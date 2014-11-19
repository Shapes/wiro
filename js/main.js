function start(){
    var wrapper = document.getElementById('wrapper');
    var scene, camera, renderer, splineCamera, cameraEye;
    var geometry, material, mesh, tube, animation=true,animiraj=true, cube;
    var width=1000, height=600, loader;

    var targetRotation = 0;
    var targetRotationOnMouseDown = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    var binormal = new THREE.Vector3();
    var normal = new THREE.Vector3();

    init();
    animate();

    function init() {

        scene = new THREE.Scene();
        
        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 );
        scene.add( light );
 
        light = new THREE.DirectionalLight( 0x002288 );
        light.position.set( -1, -1, -1 );
        scene.add( light );
 
        light = new THREE.AmbientLight( 0x222222 );
        scene.add( light );

        camera = new THREE.PerspectiveCamera(10, width / height, 0.1, 1000 );
        // Field of Vire, Aspect ratio, Near, Far
        camera.position.set(-90, 180, 300); // Y, X, Z 
        camera.lookAt(scene.position);
       
        //Create a closed bent a sine-like wave
        var spline = new THREE.SplineCurve3([
				new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 10),
            new THREE.Vector3(0, 0, 20),
            new THREE.Vector3(0, 0, 30),
            new THREE.Vector3(0, 0, 40),
            new THREE.Vector3(0, 0, 50),
            new THREE.Vector3(0, 0, 60),
            new THREE.Vector3(0, 10, 80),
            new THREE.Vector3(0, 10, 90),
            new THREE.Vector3(0, 10, 100),
            new THREE.Vector3(0, 0, 110),
            new THREE.Vector3(0, 0, 120),
            new THREE.Vector3(0, 0, 130),
            new THREE.Vector3(0, 0, 140),
            new THREE.Vector3(10, 0, 150),
            new THREE.Vector3(20, 0, 160),
            new THREE.Vector3(30, 0, 170),
            new THREE.Vector3(20, 0, 180),
            new THREE.Vector3(10, 0, 190),
            new THREE.Vector3(0, 0, 200),
            new THREE.Vector3(0, 0, 210),
            new THREE.Vector3(0, 0, 220),
            new THREE.Vector3(0, 0, 230),
            new THREE.Vector3(0, 0, 240),
            new THREE.Vector3(0, 0, 250),
            new THREE.Vector3(0, 0, 260),
            new THREE.Vector3(0, 0, 270),
            new THREE.Vector3(0, 0, 280)]);

             
        var numPoints = spline.getLength();                 // dobimo tocke
        var geometry = new THREE.Geometry();                // novo telo
        var splinePoints = spline.getPoints(numPoints);     // damo tocke v spremenljivko
        
        for (var i=0; i< splinePoints.length; i++) {
            geometry.vertices.push(splinePoints[i]);        // objektu telo nastavimo tocke
        }                                                   // v njegov array(verctices) damo tocke nasega telesa 
        

        objekt = new THREE.Object3D();                      // naredimo 3D objekt=(grupa teles)
        objekt.position.y = -25;                            // Vector3 < nastavimo pozicijo Y, ostalo privzetno 0,0
                                                            
        scene.add(objekt);                                  // na sceno dodamo objekt                
    
        
        var geometry = new THREE.BoxGeometry( 3, 3, 3);  // 500 500 500
        //var material = new THREE.MeshBasicMaterial({color: 0xfffff, wireframe: true});
        var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('images/water.jpg') } );
//        var material = new THREE.ShaderMaterial( {
//
//            uniforms: {
//                time: { type: "f", value: 1.0 },
//                resolution: { type: "v2", value: new THREE.Vector2() }
//            },
//            attributes: {
//                vertexOpacity: { type: 'f', value: [] }
//            },
//            vertexShader: document.getElementById( 'vertexShader' ).textContent,
//            fragmentShader: document.getElementById( 'fragmentShader' ).textContent
//
//        } );
        cube = new THREE.Mesh(geometry, material); 
        cube.translateX(10);
        cube.translateY(30);
        cube.translateZ(10);
        objekt.add(cube);
        
        THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
        loader = new THREE.OBJMTLLoader();
        loader.load( 'images/dog.obj', 'images/dog.mtl', function ( model ) {
            model.translateY(50);
            objekt.add( model );
        } );
        
    
        splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 1000 );
        //splineCamera.rotateOnAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(100));
        objekt.add( splineCamera );                         // postavimo spline camero na objekt
    
        tube = new THREE.TubeGeometry(spline, 200, 2, 3, false);
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
			requestAnimationFrame( animate );
			render();
        }
    }

var lookAhead=true;

    function render() {
        
        // Try Animate Camera Along Spline
        var time = Date.now();                           // Trenutni cas , milisekunde
        var looptime = 8000;                        // cas zanke ? HITROST, cas ka pridemo okoli, Vecja st 
        var t = ( time % looptime ) / looptime;         //  od 0 do 1, koficient pozicije odvisen casa
        
        
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
        
        splineCamera.position.copy( pos );
        
        // model ?
        var pos2 = tube.parameters.path.getPointAt( t+0.014 );
        pos2.z = pos2.z+2;
        pos2.x = pos2.x+2;
        cube.position.copy( pos2 );
        

        // Camera Orientation 1 - default look at
        // splineCamera.lookAt( lookAt );

        // Using arclength for stablization in look ahead.
        var lookAt = tube.parameters.path.getPointAt( ( t + 50 / tube.parameters.path.getLength() ) % 1 ).multiplyScalar( 5 );

        // Camera Orientation 2 - up orientation via normal
        if (!lookAhead)
        lookAt.copy( pos ).add( dir );
        
        splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
        splineCamera.rotation.setFromRotationMatrix( splineCamera.matrix,   splineCamera.rotation.order );
        
        cube.matrix.lookAt(splineCamera.position, lookAt, normal);
        cube.rotation.setFromRotationMatrix( splineCamera.matrix,   splineCamera.rotation.order );


        objekt.rotation.y += ( targetRotation - objekt.rotation.y ) * 0.05;
        //objekt.rotatin.x = 2;

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
