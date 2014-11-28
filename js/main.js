function start(){
    var wrapper = document.getElementById('wrapper');
    var scene, camera, renderer, splineCamera, cameraEye;

    var geometry, material, mesh, tube, animation=true,animiraj=true, cube, pos2, t;
    var width=1000, height=600, loader;
    
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
    var stevec1=0;
    var zacetekSkoka=0;
    var gameOver = true;           // stop animacije!
    
    var allO=9                              // kreiranje enega zidu 9 objektov
    var walls=5, artifacts=2, empty=2;      // stevilo dolocenih objektov
    
    var badGuys=[];
    var goodGuys=[];
    var score = 0;
    var wall1;
    var artifact;
    var gotPoints=false;

    var clock;

    init();
    animate();
    

    function init() {
        clock = new THREE.Clock(false);
        
        scene = new THREE.Scene();
        
        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 );
        scene.add( light );
 
        light = new THREE.DirectionalLight( 0x002288 );
        light.position.set( -1, -1, -1 );
        scene.add( light );
 
        light = new THREE.AmbientLight( 0x222222 );
        scene.add( light );

        camera = new THREE.PerspectiveCamera(5, width / height, 0.1, 1000 );
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
            new THREE.Vector3(0, 0, 120),
            new THREE.Vector3(0, 0, 140),
            new THREE.Vector3(0, 0, 160),
            new THREE.Vector3(0, 0, 180),
            new THREE.Vector3(0, 0, 200),
            new THREE.Vector3(0, 0, 220),
            new THREE.Vector3(0, 0, 240),
            new THREE.Vector3(0, 0, 260),
            new THREE.Vector3(0, 0, 280)]);
//            new THREE.Vector3(0, -2, 300),
//            new THREE.Vector3(0, -4, 320),
//            new THREE.Vector3(0, -6, 340),
//            new THREE.Vector3(0, -8, 360),
//            new THREE.Vector3(0, -10, 380),
//            new THREE.Vector3(0, -12, 400),
//            new THREE.Vector3(0, -14, 420),
//            new THREE.Vector3(0, -12, 440),
//            new THREE.Vector3(0, -10, 460),
//            new THREE.Vector3(0, -8, 480),
//            new THREE.Vector3(0, -6, 500),
//            new THREE.Vector3(0, -4, 520),
//            new THREE.Vector3(0, -2, 540),
//            new THREE.Vector3(0, 0, 560),
//            new THREE.Vector3(0, 0, 580),
//            new THREE.Vector3(0, 0, 600),
//            new THREE.Vector3(0, 0, 620),
//            new THREE.Vector3(0, 0, 640),
//            new THREE.Vector3(0, 0, 660),
//            new THREE.Vector3(0, 0, 680),
//            new THREE.Vector3(0, 0, 700),
//            new THREE.Vector3(0, 0, 720),
//            new THREE.Vector3(0, 0, 740),
//            new THREE.Vector3(0, 0, 760),
//            new THREE.Vector3(0, 0, 780),
//            new THREE.Vector3(0, 0, 800),
//            new THREE.Vector3(0, 0, 820),
//            new THREE.Vector3(0, 0, 840),
//            new THREE.Vector3(0, 0, 860),
//            new THREE.Vector3(0, 0, 880),
//            new THREE.Vector3(0, 0, 900),
//            new THREE.Vector3(0, 0, 920),
//            new THREE.Vector3(0, 0, 940)]);
//            new THREE.Vector3(0, 0, 0),
//            new THREE.Vector3(5, 0, 0),
//            new THREE.Vector3(0, 0, 0),
//            new THREE.Vector3(0, 0, 0)]);


       
        
        var numPoints = spline.getLength();                 // dobimo tocke
        var geometry = new THREE.Geometry();                // novo telo
        var splinePoints = spline.getPoints(numPoints);     // damo tocke v spremenljivko
        
        for (var i=0; i< splinePoints.length; i++) {
            geometry.vertices.push(splinePoints[i]);        // objektu telo nastavimo tocke
        }                                                   // v njegov array(verctices) damo tocke nasega telesa 
        

        objekt = new THREE.Object3D();                      // naredimo 3D objekt=(grupa teles)
        objekt.position.y = 0;                            // Vector3 < nastavimo pozicijo Y, ostalo privzetno 0,0
                                                            
        scene.add(objekt);                                  // na sceno dodamo objekt      
        
        
    
        var geometry = new THREE.BoxGeometry( 1, 1, 1);  // 500 500 500
        var material = new THREE.MeshBasicMaterial({color: 0xfffAA, wireframe: false});
        cube = new THREE.Mesh(geometry, material); 

        objekt.add(cube);
        
        THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
        loader = new THREE.OBJMTLLoader();
        loader.load( 'images/dog.obj', 'images/dog.mtl', function ( model ) {
            model.translateY(50);
            //objekt.add( model );
        } );
        
    
        splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 1000 );
        //splineCamera.rotateOnAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(100));
        scene.add( splineCamera );  // postavimo spline camero na objekt    
        tube = new THREE.TubeGeometry(spline, 200, 5, 3, false);
        // new THREE.Curves.KnotCurve() / spline
        // naredimo TUBE okoli 3D linije, PARAMETRI: PATH(deduje od Curve), Stevilo na koliko je lomljen path, Polmer=sirina steze,
        // closed = true =se zliva skupaj
        addGeometry(tube, 0xF4A460);
	    //TMesh = new THREE.Mesh(tube, material);
        //objekt.add(TMesh);
        
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( width, height );

        wrapper.appendChild( renderer.domElement );

        renderer.render( scene, animation === true ? splineCamera : camera );
        renderer.setClearColor( 0xf0f0f0 );
    }
    
    
    function addGeometry( geometry, color ) {
        tubeMesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [
            new THREE.MeshLambertMaterial({
                color: color,
                shading: THREE.FlatShading
            }),
            new THREE.MeshBasicMaterial({
                color: 0x0,            
                opacity: 0.3,
                wireframe: true,
                transobjekt: true
            })
        ]);

        objekt.add( tubeMesh );

    }

    function animate() {
        if(animiraj){
            for(var i=0; i<goodGuys.length; i++) {
                goodGuys[i].rotation.y += 0.1;
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
    function createArtifact(aGeometry, aMaterial, ax, ay, az) {
        artifact = new THREE.Mesh(aGeometry, aMaterial);
            
        var posArtifact = new THREE.Vector3();
        posArtifact.x = ax;
        posArtifact.y = ay;
        posArtifact.z = az;
        artifact.position.copy(posArtifact);
        goodGuys.push(artifact);
    }
    
// - - - - - - - - - - - KREIRANJE MREZE - - - - - -  - - - - - 
//    
    function createObsticle(z) {
        var geometryWall = new THREE.BoxGeometry(2, 2, 0.5);
        var materialWall = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('images/wall.jpg') });
        var geometryArtifact = new THREE.BoxGeometry(2, 2, 0.5);
        var materialArtifact = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('images/gold.jpg') });
        var filled=false;
        
        // levo spodaj
       // var x=-2.5, y=-3;
        //while (allO!=0) { 
        //for (var i; i<allO; i++) {
            if(allO==9 || allO==4 || allO==3) x=-2;
            if(allO==8 || allO==5 || allO==2) x=0;
            if(allO==7 || allO==6 || allO==1) x=2;
            
            if(allO==9 || allO==8 || allO==7) y=-3.5;
            if(allO==4 || allO==5 || allO==6) y=-5.5;
            if(allO==1 || allO==2 || allO==3) y=-7.5;
            while (filled==false) { 
                var random = Math.floor(Math.random() * 3) + 1;
                if (random == 1 && walls!=0){
                    createWall(geometryWall, materialWall, x, y, z);
                    walls--; filled = true; allO--; break;
                } else if(random == 2 && artifacts!=0) {
                    createArtifact(geometryArtifact, materialArtifact, x, y, z);
                    artifacts--; filled = true; allO--; break;
                } else if(random == 3 && empty!=0) {
                    empty--; filled = true; allO--; break;
                } else {
                    continue;
                }
            }
            console.log(allO);
       // }    
    }
    
    var renderLoop=0;
    function render() {
        renderLoop++;
    
        // Try Animate Camera Along Spline
        var time = clock.getElapsedTime(); //Date.now();                           // Trenutni cas , milisekunde
        console.log(time);
        var looptime = 50;                        // cas zanke ? HITROST, cas ka pridemo okoli, Vecja st 
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

        var offset = 2.9;

        normal.copy( binormal ).cross( dir );

        // We move on a offset on its binormal
        pos.add( normal.clone().multiplyScalar( offset ) );
        pos.y = pos.y-1;
        pos.z = pos.z-2;
        splineCamera.position.copy( pos );
        pos2 = tube.parameters.path.getPointAt( t+0.0004 );

        // model ?
        if((time-zacetekSkoka)>1) {           // cakanje pol sekunde za morebiten drugi skok, ce ne padec na pozicijo 0
            skok=0;
            stevec=0;
            stevec1=0;
            skocil=false;
            drugiSkok=false;
        }
        pos2.z = pos2.z+2;
        pos2.y = pos2.y-3 + skok;
        //pos2.y = pos2.y-3.5 + skok;
        pos2.x = pos2.x+odstopanje;
       // var tween = new TWEEN.Tween(pos2.x).to(pos2.x+odstopanje, 500);   
        //tween.onUpdate(function() {
        //    pos2.x = pos2.x;
        //});
            
        if(renderLoop==1) {
//            var geometry = new THREE.BoxGeometry(2, 2, 0.1);
//            var material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('images/wall.jpg') });
//            
//            var z = 420;
//            createWall(geometry, material, 0, -3, 80);
//            
//            var geometry = new THREE.BoxGeometry(1, 1, 0.1);
//            var material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('images/gold.jpg') });
//            
//            createArtifact(geometry, material, 2.5, -3, 80);
//          
            
        
        for(i=0; i<9; i++) {
                createObsticle(80);
        }
        
        allO=9; walls=5; artifacts=2; empty=2; 
        
        for(i=0; i<9; i++) {
            createObsticle(100);
        }
        
         allO=9; walls=5; artifacts=2; empty=2; 
        
        for(i=0; i<9; i++) {
            createObsticle(120);
        }
            
            
            
            for (var i=0; i<badGuys.length; i++) {
                objekt.add(badGuys[i]);
            }
             for (var i=0; i<goodGuys.length; i++) {
                objekt.add(goodGuys[i]);
            }
            
            //for(i=0; i<9; i++) {
            //    createObsticle(100);
            //}
            
        }
        
        //console.log(stevecHorizontal);
        
        if(keyboard.pressed("A")) {
            if(right) {
                odstopanje = 0;
            } else {
                odstopanje = -2.5;
                left=true;
            }
            
        }
        
        if(keyboard.pressed("D")) {
            if(left) {
                odstopanje = 0;
            } else {
                odstopanje = +2.5; 
                right=true;
            }
        }
        keyboard.domElement.addEventListener('keyup', function(event){
            if( keyboard.eventMatches(event, 'D') )	{
               left=false;
            }
        });
        keyboard.domElement.addEventListener('keyup', function(event){
            if( keyboard.eventMatches(event, 'A') )	{
               right=false;
            }
        });
        if (keyboard.pressed("W")) {
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
            if( keyboard.eventMatches(event, 'W') )	{
                stevec1++;
                if(stevec1<2) {
                    drugiSkok=true;
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
            if( keyboard.eventMatches(event, 'S') )	{
                gameOver = false;
                clock.start();
            }
        });
        
        cube.position.copy(pos2);
        
// -------------------- collision detection -------------------------------
        
        var originPoint = cube.position.clone();            // pozicija lika za izvor ray vektorja
	    gotPoints=false;

        for (var vertexIndex = 0; vertexIndex < cube.geometry.vertices.length; vertexIndex++) {		
            var directionVector = new THREE.Vector3(0,0,1);         // zarek, ki gleda naprej
            var ray = new THREE.Raycaster( originPoint, directionVector, 0, 1);
            
            for (var i=0; i<goodGuys.length; i++) {
                var collisionResultsGG = ray.intersectObject(goodGuys[i]);
                
                if(collisionResultsGG.length > 0) {
                    gotPoints=true;
                    objekt.remove(goodGuys[i]);
                    console.log("tockaaa");
                }
            }
            
            for(var i=0; i<badGuys.length; i++) {
                var collisionResults = ray.intersectObject( badGuys[i] );    

                if ( collisionResults.length > 0  ) {
                    console.log(" Hit ");
                    clock.stop();
                    gameOver=true;
                }
            }
        }	
        
        
        

        // Camera Orientation 1 - default look at
        // splineCamera.lookAt( lookAt );

        // Using arclength for stablization in look ahead.
        var lookAt = tube.parameters.path.getPointAt( ( t + 50 / tube.parameters.path.getLength() ) % 1 ).multiplyScalar( 5 );

        // Camera Orientation 2 - up orientation via normal
        //if (!lookAhead)
        //lookAt.copy( pos ).add( dir );
        
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
    
    
    
}

THREE.Curves = {};                                  // dedovanje Od Curves
THREE.Curves.KnotCurve = THREE.Curve.create(        // matematika za PATH iz katerega zgradimo potem TUBE
                                                    // KnotCurve Deduje od Curve in mu nastavimo costum create
	function() {},
	function(t) {       //getPoint: t is between 0-1

		t *= 2 * Math.PI;

		var R = 10;
		var s = 50;
		var tx = s * Math.sin(t),
        ty = Math.cos(t) * (R + s * Math.cos(t)),
        tz = Math.sin(t) * (R + s * Math.cos(t));

		return new THREE.Vector3(tx, ty, tz);

	}

);
