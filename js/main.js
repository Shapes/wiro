function start(){
    var wrapper = document.getElementById('wrapper');
    var scene, camera, renderer, splineCamera, cameraEye;

    var geometry, material, mesh, tube, animation=true,animiraj=true, cube, pos2, t, posModel, posLight, time;
    var model = new THREE.Mesh();
    var width=1000, height=600, run = false;
    
    var targetRotation = 0;
    var targetRotationOnMouseDown = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    var binormal = new THREE.Vector3();
    var normal = new THREE.Vector3();
    
    //keyboard input
    var keyboard = new THREEx.KeyboardState();
    
    var odstopanje=0;
    var skok=0;
    var left=false;         // pomoc pri manevriranju s tipkami
    var right=true;
    var skocil=false;
    var drugiSkok=false;
    var stevec=0;  // pomoc pri timeoutu za skok.
    var stevec1=0, startSkok=0;
    var zacetekSkoka=0;
    var gameOver = false;           // stop animacije!
    
    var allO=9                              // kreiranje enega zidu 9 objektov
    var walls=5, artifacts=2, empty=2;      // stevilo dolocenih objektov
    var numBG=walls, numGG=artifacts;
    
    var badGuys=[];
    var goodGuys=[];
    var GGVisible=[];
    
    var score = 0;
    var stScore=0;
    var wall1;
    var artifact;
    var artifactVisible;
    var gotPoints=false;
    var tockeSpline;
    var clock;
    var indexObjekta=1;
    
        // the following code is from
    var animOffset       = 0,   // starting frame of animation
	walking         = false,
	duration        = 250, // milliseconds to complete animation
	keyframes       = 20,   // total number of animation frames
	interpolation   = duration / keyframes, // milliseconds per frame
	lastKeyframe    = 0,    // previous keyframe
	currentKeyframe = 0;

    model.morphTargetInfluences = [];
    
    var loader = new THREE.JSONLoader();
    

    init();
    animate();
    

    function init() {
        clock = new THREE.Clock(false);             // clock, false == autostart
        scene = new THREE.Scene();
        
        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 );
        scene.add( light );

        light2 = new THREE.DirectionalLight( 0xFFFfff );
        light2.position.set( -1, -1, -1 );
        scene.add( light2 );
       // lightcamera= new THREE.DirectionalLight()
 
        light = new THREE.AmbientLight( 0x222222 );
        scene.add( light );

        camera = new THREE.PerspectiveCamera(5, width / height, 0.1, 1000 );            // nepomembna kamera trenutno
        // Field of Vire, Aspect ratio, Near, Far
        camera.position.set(0, 900, 0); // Y, X, Z 
        camera.lookAt(scene.position);
        camera.rotation.y = -1 * Math.PI / 180;
       
        //Create a closed bent a sine-like wave
        var spline = new THREE.SplineCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 20),
            new THREE.Vector3(0, 0, 40),
            new THREE.Vector3(0, 0, 60),
            new THREE.Vector3(0, 0, 80),
            new THREE.Vector3(0, 0, 100),
            new THREE.Vector3(1, 0, 120),
            new THREE.Vector3(2, 0, 140),
            new THREE.Vector3(3, 0, 160),
            new THREE.Vector3(4, 0, 180),
            new THREE.Vector3(5, 0, 200),
            new THREE.Vector3(6, 0, 220),
            new THREE.Vector3(7, 0, 240),
            new THREE.Vector3(8, 0, 260),
            new THREE.Vector3(9, 0, 280),
            new THREE.Vector3(8, -1, 300),
            new THREE.Vector3(7, -2, 320),
            new THREE.Vector3(6, -3, 340),
            new THREE.Vector3(5, -4, 360),
            new THREE.Vector3(4, -5, 380),
            new THREE.Vector3(3, -6, 400),
            new THREE.Vector3(2, -7, 420),
            new THREE.Vector3(1, -6, 440),
            new THREE.Vector3(0, -5, 460),
            new THREE.Vector3(0, -4, 480),
            new THREE.Vector3(0, -3, 500),
            new THREE.Vector3(0, -2, 520),
            new THREE.Vector3(0, -1, 540),
            new THREE.Vector3(0, 0, 560),
            new THREE.Vector3(0, 0, 580),
            new THREE.Vector3(0, 0, 600),
            new THREE.Vector3(0, 0, 620),
            new THREE.Vector3(-2, 0, 640),
            new THREE.Vector3(-4, 0, 660),
            new THREE.Vector3(-6, 0, 680),
            new THREE.Vector3(-8, 0, 700),
            new THREE.Vector3(-10, 0, 720),
            new THREE.Vector3(-12, 0, 740),
            new THREE.Vector3(-14, 0, 760),
            new THREE.Vector3(-12, 0, 780),
            new THREE.Vector3(-10, 0, 800),
            new THREE.Vector3(-8, 0, 820),
            new THREE.Vector3(-6, 0, 840),
            new THREE.Vector3(-4, 0, 860),
            new THREE.Vector3(-2, 0, 880),
            new THREE.Vector3(0, 0, 900),
            new THREE.Vector3(0, 0, 920),
            new THREE.Vector3(0, 0, 940),
            new THREE.Vector3(0, 0, 960),
            new THREE.Vector3(0, 0, 980),
            new THREE.Vector3(0, 0, 1000),
            new THREE.Vector3(0, 0, 1020),
            new THREE.Vector3(0, 0, 1040),
            new THREE.Vector3(0, 0, 1060)]);
        tockeSpline = [
            new THREE.Vector3(0, 0, 60),
            new THREE.Vector3(0, 0, 80),
            new THREE.Vector3(0, 0, 100),
            new THREE.Vector3(1, 0, 120),
            new THREE.Vector3(2, 0, 140),
            new THREE.Vector3(3, 0, 160),
            new THREE.Vector3(4, 0, 180),
            new THREE.Vector3(5, 0, 200),
            new THREE.Vector3(6, 0, 220),
            new THREE.Vector3(7, 0, 240),
            new THREE.Vector3(8, 0, 260),
            new THREE.Vector3(9, 0, 280),
            new THREE.Vector3(8, -1, 300),
            new THREE.Vector3(7, -2, 320),
            new THREE.Vector3(6, -3, 340),
            new THREE.Vector3(5, -4, 360),
            new THREE.Vector3(4, -5, 380),
            new THREE.Vector3(3, -6, 400),
            new THREE.Vector3(2, -7, 420),
            new THREE.Vector3(1, -6, 440),
            new THREE.Vector3(0, -5, 460),
            new THREE.Vector3(0, -4, 480),
            new THREE.Vector3(0, -3, 500),
            new THREE.Vector3(0, -2, 520),
            new THREE.Vector3(0, -1, 540),
            new THREE.Vector3(0, 0, 560),
            new THREE.Vector3(0, 0, 580),
            new THREE.Vector3(0, 0, 600),
            new THREE.Vector3(0, 0, 620),
            new THREE.Vector3(-2, 0, 640),
            new THREE.Vector3(-4, 0, 660),
            new THREE.Vector3(-6, 0, 680),
            new THREE.Vector3(-8, 0, 700),
            new THREE.Vector3(-10, 0, 720),
            new THREE.Vector3(-12, 0, 740),
            new THREE.Vector3(-14, 0, 760),
            new THREE.Vector3(-12, 0, 780),
            new THREE.Vector3(-10, 0, 800),
            new THREE.Vector3(-8, 0, 820),
            new THREE.Vector3(-6, 0, 840),
            new THREE.Vector3(-4, 0, 860),
            new THREE.Vector3(-2, 0, 880),
            new THREE.Vector3(0, 0, 900),
            new THREE.Vector3(0, 0, 920),
           ];

        var numPoints = spline.getLength();                 // dobimo tocke
        var geometry = new THREE.Geometry();                // novo telo
        var splinePoints = spline.getPoints(numPoints);     // damo tocke v spremenljivko
        
        for (var i=0; i< splinePoints.length; i++) {
            geometry.vertices.push(splinePoints[i]);        // objektu telo nastavimo tocke
        }                                                   // v njegov array(verctices) damo tocke nasega telesa 
        
        objekt = new THREE.Object3D();                      // naredimo 3D objekt=(grupa teles)
        objekt.position.y = 0;                            // Vector3 < nastavimo pozicijo Y, ostalo privzetno 0,0
                                                            
        scene.add(objekt);                                  // na sceno dodamo objekt      
        
        
    
        
    
        var geometry = new THREE.BoxGeometry( 1, 1, 1);  // glavni lik igre
        cube = new THREE.Mesh(geometry, material); 
        objekt.add(cube);
    
        var geometry = new THREE.SphereGeometry(1000, 50, 50);
        var material = new THREE.MeshLambertMaterial( {map: THREE.ImageUtils.loadTexture('images/sphere.png'), side: THREE.BackSide});
        
    
        var sphereMesh = new THREE.Mesh(geometry, material);    
        scene.add(sphereMesh);
        
        
        loader.load( "model/modelA.js", addModelToSpline );
        
    
        splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 1000 );
        //splineCamera.rotateOnAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(100));
        scene.add( splineCamera );  // postavimo spline camero na objekt    
        tube = new THREE.TubeGeometry(spline, 1000, 5, 3, false);
        // new THREE.Curves.KnotCurve() / spline
        // naredimo TUBE okoli 3D linije, PARAMETRI: PATH(deduje od Curve), Stevilo na koliko je lomljen path, Polmer=sirina steze,
        // closed = true =se zliva skupaj
        addGeometry(tube, 0xF4A460);
	    //TMesh = new THREE.Mesh(tube, material);
        //objekt.add(TMesh);
        
//        for(i=0; i<9; i++) {                        // dodajanje celotnega zidu 9 različnih objektov - vključno s prazninami.
//            createObsticle(80);
//        }
//
//        allO=9; walls=5; artifacts=2; empty=2;      // ponastavljanje vrednosti.
//
//        for(i=0; i<9; i++) {
//            createObsticle(95);
//        }
//
//         allO=9; walls=5; artifacts=2; empty=2; 
//
//        for(i=0; i<9; i++) {
//            createObsticle(110);
//        }
    
//
//        for(var i=0; i<tockeSpline.length; i++) {
//            finalObsticle(tockeSpline[i].x, tockeSpline[i].y, tockeSpline[i].z);
//            console.log("done");
//        }

//        for (var i=0; i<numBG*tockeSpline.length; i++) {              // risanje objektov na sceno (badguys + goodguys)
//            objekt.add(badGuys[i]);
//        }
//        for (var i=0; i<numGG*tockeSpline.length; i++) {
//            objekt.add(goodGuys[i]);
//        }
//        
        cube.visible=false;
        
        
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( width, height );

        wrapper.appendChild( renderer.domElement );

        renderer.render( scene, animation === true ? splineCamera : camera );
        renderer.setClearColor( 0xf0f0f0 );
    }

    function addModelToSpline( geometry, materials ){    
        
        //for (var i = 0; i < materials.length; i++)
        //materials[i].morphTargets = true;
        for (var i = 0; i < materials.length; i++)
		  materials[i].morphTargets = true;
		
        var material = new THREE.MeshFaceMaterial( materials );
        model = new THREE.Mesh( geometry, material );
        model.scale.set(0.5,0.5,0.5);
        model.rotation.x = 3.7;
        objekt.add( model );
    }
    
    
    function addGeometry( geometry, color ) {
        tubeMesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [
            new THREE.MeshLambertMaterial({
                color: color,
                shading: THREE.FlatShading
            }),
//            new THREE.MeshBasicMaterial({
//                color: 0x0,            
//                opacity: 0.3,
//                //wireframe: true,
//                transobjekt: true
//            }),
            new THREE.MeshPhongMaterial( { 
            color: 0x061D45, 
            ambient: 0x061D45, // should generally match color
            specular: 0x050505,
            shininess: 100
            }), 
        ]);

        objekt.add( tubeMesh );

    }

    function animate() {
        if(animiraj){
            for(var i=0; i<goodGuys.length; i++) {
                GGVisible[i].rotation.x += 0.1;
            }
			requestAnimationFrame( animate );
            render();
        }
    }
    
    
// - - - - - - - - - - - KREIRANJE ZIDOV - - - - - - -- - - - - -
    function createWall(wGeometry, wMaterial, wx, wy, wz) {         
        wall1 = new THREE.Mesh(wGeometry, wMaterial);
        var posObsticle = new THREE.Vector3();    
        posObsticle.x = wx;
        posObsticle.y = wy;
        posObsticle.z = wz;
        wall1.position.copy(posObsticle);
        badGuys.push(wall1);
    }
// - - - - - - - - - - - KREIRANJE ARTIFACTOV -- - - - - - - - -     
    function createArtifact(aGeometry, aMaterial, ax, ay, az, geometryVisible, materialVisible) {
        
        artifact = new THREE.Mesh(aGeometry, aMaterial);
        visibleArtifact = new THREE.Mesh(geometryVisible, materialVisible);
            
        var posArtifact = new THREE.Vector3();
        posArtifact.x = ax;
        posArtifact.y = ay;
        posArtifact.z = az;
        visibleArtifact.rotation.z = 0.9;
        artifact.position.copy(posArtifact);
        visibleArtifact.position.copy(posArtifact);
        goodGuys.push(artifact);
        GGVisible.push(visibleArtifact);
    }
    
// - - - - - - - - - - - KREIRANJE MREZE - - - - - -  - - - - - 
//  
    function finalObsticle(x, y, z) {
        allO=9; walls=5; artifacts=2; empty=2;      // ponastavljanje vrednosti.

        for(i=0; i<9; i++) {
            createObsticle(x,y,z);
        }
    }
    
    function createObsticle(x, y, z) {
        var geometryWall = new THREE.BoxGeometry(2, 2, 0.5, 2, 2);
        var materialWall = new THREE.MeshLambertMaterial({ color: 0xBF5454, wireframe: true, wireframeLinewidth: 10, shading: THREE.FlatShading });//
        var geometryArtifact = new THREE.BoxGeometry(2, 2, 0.5, 2, 2);
        var materialArtifact = new THREE.MeshLambertMaterial({ color: 0x00ff00, wireframe: true, wireframeLinewidth: 10, shading: THREE.FlatShading });
        var geometryVisible = new THREE.CylinderGeometry(1, 1, 0.1, 10, 0, false);
        var materialVisible = new THREE.MeshLambertMaterial({ color: 0xf0f0f0, wireframe: true, wireframeLinewidth: 10, shading: THREE.FlatShading });
        var filled=false;

        if(allO==9 || allO==4 || allO==3) x=x-2.2;
        if(allO==8 || allO==5 || allO==2) x=x;
        if(allO==7 || allO==6 || allO==1) x=x+2.2;

        if(allO==9 || allO==8 || allO==7) y=y-3.5;
        if(allO==4 || allO==5 || allO==6) y=y-5.7;
        if(allO==1 || allO==2 || allO==3) y=y-7.9;
        while (filled==false) { 
            var random = Math.floor(Math.random() * 3) + 1;
            if (random == 1 && walls!=0){
                createWall(geometryWall, materialWall, x, y, z);
                walls--; filled = true; allO--; break;
            } else if(random == 2 && artifacts!=0) {
                createArtifact(geometryArtifact, materialArtifact, x, y, z, geometryVisible, materialVisible);
                artifacts--; filled = true; allO--; break;
            } else if(random == 3 && empty!=0) {
                empty--; filled = true; allO--; break;
            } else {
                continue;
            }
        }
    }
    
    function update() {
        // ------------------------ keyboard input --------------------------------------------------
        if(keyboard.pressed("left")) {
            if(right) {
                odstopanje = 0;
            } else {
                odstopanje = -2.5;
                left=true;
            } 
        }
        
        if(keyboard.pressed("right")) {
            if(left) {
                odstopanje = 0;
            } else {
                odstopanje = +2.5; 
                right=true;
            }
        }
        keyboard.domElement.addEventListener('keyup', function(event){
            if( keyboard.eventMatches(event, 'right') )	{
               left=false;
            }
        });
        keyboard.domElement.addEventListener('keyup', function(event){
            if( keyboard.eventMatches(event, 'left') )	{
               right=false;
            }
        });
        if (keyboard.pressed("up")) {
            if(drugiSkok) {
                skok=-4;
            }
            stevec++;
            if(stevec<2) {
                skok=-2;
                zacetekSkoka=time;
                skocil=true;
            }
        }
        
         keyboard.domElement.addEventListener('keyup', function(event){
            if( keyboard.eventMatches(event, 'up') )	{
                startSkok++;
                if(startSkok==1) {
                    gameOver = false;
                    clock.start(); 
                    $( '#start' ).fadeOut( "slow" );
                    $('#startgame').fadeOut( "slow" );
                     $(".overWrapper" ).addClass("none");
                    run=true;
                } else {
                    stevec1++;
                    if(stevec1<2) {
                        drugiSkok=true;
                    }
                }
            }
        });
        
        keyboard.domElement.addEventListener('keyup', function(event){
            if( keyboard.eventMatches(event, 'P') )	{
                gameOver = true;
                clock.stop();
            }
        });
        
        
        keyboard.domElement.addEventListener('keyup', function(event){
            if( keyboard.eventMatches(event, 'R') )	{
                location.reload();
            }
        });
        
        posModel=pos2;
        cube.position.copy(pos2);
        posModel.y = posModel.y+0.4;
        posModel.z=posModel.z+0.4;
        model.position.copy(posModel);
        
        
        if ( model && run ){
            // Alternate morph targets
            time = new Date().getTime() % duration;
            keyframe = Math.floor( time / interpolation ) + animOffset;
            if ( keyframe != currentKeyframe ) 
            {
                model.morphTargetInfluences[ lastKeyframe ] = 0;
                model.morphTargetInfluences[ currentKeyframe ] = 1;
                model.morphTargetInfluences[ keyframe ] = 0;
                lastKeyframe = currentKeyframe;
                currentKeyframe = keyframe;
            }
            model.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
            model.morphTargetInfluences[ lastKeyframe ] = 1 - model.morphTargetInfluences[ keyframe ];
	   }
        
        
        
// -------------------- collision detection -------------------------------
        
        var originPoint = cube.position.clone();            // pozicija lika za izvor ray vektorja
	    gotPoints=false;

        for (var vertexIndex = 0; vertexIndex < cube.geometry.vertices.length; vertexIndex++) {		
            var directionVector = new THREE.Vector3(0,0,1);         // zarek, ki gleda naprej
            var ray = new THREE.Raycaster( originPoint, directionVector, 0.1, 1.0);
            
            for (var i=0; i<goodGuys.length; i++) {
                var collisionResultsGG = ray.intersectObject(goodGuys[i]);
                
                if(collisionResultsGG.length > 0) {
                    stScore++;
                    gotPoints=true;
                    objekt.remove(goodGuys[i]);
                    objekt.remove(GGVisible[i]);
                    if(stScore==1) score++;
                    
                    var str = score.toString();
                    var tocke =  str.concat("&nbsp;&nbsp;");
                    $('.score').text( str );
                }
            }
            
            for(var i=0; i<badGuys.length; i++) {
                var collisionResults = ray.intersectObject( badGuys[i] );    

                if ( collisionResults.length > 0  ) {
                    //console.log(" Hit ");
                    clock.stop();
                    gameOver=true;
                    run=false;
                    $('#gameover').fadeIn();
                    $(".overWrapper" ).removeClass("none");
                }
            }
        }	
        
        
        


    }

    var renderLoop=0;
    function render() {
        renderLoop++;
    
        // Try Animate Camera Along Spline
        time = clock.getElapsedTime();          // Cas pretecenei od clock.start do klica getElapsedTime v sekundah
        var looptime =30;                        // cas zanke ? HITROST, cas ka pridemo okoli, Vecja st 
        t = ( time % looptime ) / looptime;         //  od 0 do 1, koficient pozicije odvisen casa
        
        
        var pos = tube.parameters.path.getPointAt( t );  // dobimo pozicijo na Tubu glede na T
        //console.log(pos);
        //pos.multiplyScalar(10);         
        
        // interpolation
        var segments = tube.tangents.length;
        var pickt = t * segments;
        var pick = Math.floor( pickt );
        var pickNext = ( pick + 1 ) % segments;

        binormal.subVectors( tube.binormals[ pickNext ], tube.binormals[ pick ] );
        binormal.multiplyScalar( pickt - pick ).add( tube.binormals[ pick ] );

        

        var dir = tube.parameters.path.getTangentAt( t );

        var offset = 3.2;

        normal.copy( binormal ).cross( dir );

        // We move on a offset on its binormal
        pos.add( normal.clone().multiplyScalar( offset ) );
        pos.y = pos.y-2;        // pozicija glavne kamere po oseh
        pos.z = pos.z-1.5;
        splineCamera.position.copy( pos );
        pos2 = tube.parameters.path.getPointAt( t );

        if((time-zacetekSkoka)>0.5) {           // dolzina skoka prve stopnje (da imamo cas skociti se na drugo stopnjo)
            skok=0;
            stevec=0;
            stevec1=0;
            skocil=false;
            drugiSkok=false;
        }
        pos2.z = pos2.z+2;
        pos2.y = pos2.y-3 + skok;           // skok in odstopanje se pristejeta ob pritisku ustrezne tipke (-3 -> zravnano s podlago zaradi odstopanja splina)
        pos2.x = pos2.x+odstopanje;
       
            
        if(renderLoop==1) {
            
            finalObsticle(0,0,60);
            finalObsticle(0,0,80);
            finalObsticle(0,0,100);
            
            for (var i=0; i<numBG*3; i++) {              // risanje objektov na sceno (badguys + goodguys)
                objekt.add(badGuys[i]);
            }
             for (var i=0; i<numGG*3; i++) {
                objekt.add(goodGuys[i]);
                goodGuys[i].visible=false;
                objekt.add(GGVisible[i]);
            }
            var gameOver = true;
        }
        
        var trenutnaPozicijaLika = (tube.parameters.path.getPointAt(t)).z;
        if(trenutnaPozicijaLika>940) {
            clock.stop();
            gameOver=true;
            run=false;
            $('#congretz').show();
        } else {
            if((trenutnaPozicijaLika>(40+20*indexObjekta)) && (trenutnaPozicijaLika<(43+20*indexObjekta))) {
                //console.log("koji kurac");

                for(var i=(indexObjekta-1)*numBG; i<numBG*indexObjekta; i++) {
                    objekt.remove(badGuys[i]);
                }
                for(var i=(indexObjekta-1)*numGG; i<numGG*indexObjekta; i++) {
                    objekt.remove(goodGuys[i]);
                    objekt.remove(GGVisible[i]);
                }
                
                if(trenutnaPozicijaLika<880) {
                    finalObsticle(tockeSpline[indexObjekta+2].x, tockeSpline[indexObjekta+2].y, tockeSpline[indexObjekta+2].z);

                    for (var i=numBG*(indexObjekta+2); i<numBG*(indexObjekta+3); i++) {             
                        objekt.add(badGuys[i]);
                    }
                     for (var i=numGG*(indexObjekta+2); i<numGG*(indexObjekta+3); i++) {
                        objekt.add(goodGuys[i]);
                        goodGuys[i].visible=false;
                        objekt.add(GGVisible[i]);

                        //restart();
                    }

                    indexObjekta++;
                    //console.log(indexObjekta);
                }
                stScore=0;
            }
        }
//      
        
        
        update();

        // Using arclength for stablization in look ahead.
        var lookAt = tube.parameters.path.getPointAt( ( t + 50 / tube.parameters.path.getLength() ) % 1 ).multiplyScalar( 5 );
        
        splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
        splineCamera.rotation.setFromRotationMatrix( splineCamera.matrix,   splineCamera.rotation.order );
        
        cube.matrix.lookAt(splineCamera.position, lookAt, normal);
        cube.rotation.setFromRotationMatrix( splineCamera.matrix,   splineCamera.rotation.order );
        

        objekt.rotation.y += ( targetRotation - objekt.rotation.y ) * 0.05;
        //objekt.rotatin.x = 2;
        if(!gameOver)
            renderer.render( scene, animation === true ? splineCamera : camera );
        //renderer.render( scene, camera );
        renderer.setClearColor( 0xf0f0f0 );
    }
    
    $( '#start' ).click(function() {
      gameOver = false;
        run = true;
      clock.start();
      $( '#start' ).fadeOut( "slow" );
      $('#startgame').hide();
        $(".overWrapper" ).addClass("none");
    });
    
}
