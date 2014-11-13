function start(){
    var wrapper = document.getElementById('wrapper');
    var scene, camera, renderer, splineCamera, cameraEye;
    var geometry, material, mesh, tube, animation=true,animiraj=true;
    var width=1000, height=600;

    var targetRotation = 0;
    var targetRotationOnMouseDown = 0;

    var mouseX = 0;
    var mouseXOnMouseDown = 0;

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

        camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000 );
        // Field of Vire, Aspect ratio, Near, Far
        camera.position.set(0, 50, 500); // X, Y, Z 
        camera.lookAt(scene.position);
       
        
        var spline = new THREE.SplineCurve3([
				new THREE.Vector3(0, 10, -10),
                new THREE.Vector3(10, 0, -10),
                new THREE.Vector3(20, 0, 0),
                new THREE.Vector3(30, 0, 10),
                new THREE.Vector3(30, 0, 20),
                new THREE.Vector3(20, 0, 30),
                new THREE.Vector3(10, 0, 30),
                new THREE.Vector3(0, 0, 30),
                new THREE.Vector3(-10, 10, 30),
                new THREE.Vector3(-10, 20, 30),
                new THREE.Vector3(0, 30, 30),
                new THREE.Vector3(10, 30, 30),
                new THREE.Vector3(20, 30, 15),
                new THREE.Vector3(10, 30, 10),
                new THREE.Vector3(0, 30, 10),
                new THREE.Vector3(-10, 20, 10),
                new THREE.Vector3(-10, 10, 10),
                new THREE.Vector3(0, 0, 10),
                new THREE.Vector3(10, -10, 10),
                new THREE.Vector3(20, -15, 10),
                new THREE.Vector3(30, -15, 10),
                new THREE.Vector3(40, -15, 10),
                new THREE.Vector3(50, -15, 10),
                new THREE.Vector3(60, 0, 10),
                new THREE.Vector3(70, 0, 0),
                new THREE.Vector3(80, 0, 0),
                new THREE.Vector3(90, 0, 0),
                new THREE.Vector3(100, 0, 0)]);
        
        var numPoints = spline.getLength();

        
        var sampleClosedSpline = new THREE.ClosedSplineCurve3([
			new THREE.Vector3(0, -40, -40),
			new THREE.Vector3(0, 40, -40),
			new THREE.Vector3(0, 140, -40),
			new THREE.Vector3(0, 40, 40),
			new THREE.Vector3(0, -40, 40),
		]);
        
        
        var geometry = new THREE.Geometry();
        var splinePoints = spline.getPoints(numPoints);
        
        for (var i=0; i< splinePoints.length; i++) {
            geometry.vertices.push(splinePoints[i]);
        }
        

        var line = new THREE.Line(geometry, material);


        parent = new THREE.Object3D();
        parent.position.y = 100;
        scene.add( parent );
    
        splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 1000 );
        parent.add( splineCamera );
        //splineCamera.rotateOnAxis(new THREE.Vector3(1, 0, 0), degInRad(10));
        
        tube = new THREE.TubeGeometry(new THREE.Curves.KnotCurve(), 200, 2, 3, true);
        addGeometry(tube, 0xF4A460);
	    
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( width, height );

        wrapper.appendChild( renderer.domElement );

        renderer.render( scene, splineCamera );
        renderer.setClearColor( 0xf0f0f0 );
    }

    function addGeometry( geometry, color ) {
        tubeMesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [
            new THREE.MeshLambertMaterial({
                color: color
            }),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                opacity: 0.3,
                wireframe: true,
                transparent: true
        })]);

        parent.add( tubeMesh );

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
        var time = Date.now();                           // Trenutni ca
        var looptime = 20 * 5000;                        // cas zanke ? HITROST 
        var t = ( time % looptime ) / looptime;

        var pos = tube.parameters.path.getPointAt( t );
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

        var offset = 2.8;

        normal.copy( binormal ).cross( dir );

        // We move on a offset on its binormal
        pos.add( normal.clone().multiplyScalar( offset ) );
        
        splineCamera.position.copy( pos );
        //cameraEye.position.copy( pos );


        // Camera Orientation 1 - default look at
        // splineCamera.lookAt( lookAt );

        // Using arclength for stablization in look ahead.
        var lookAt = tube.parameters.path.getPointAt( ( t + 30 / tube.parameters.path.getLength() ) % 1 ).multiplyScalar( 5 );

        // Camera Orientation 2 - up orientation via normal
        if (!lookAhead)
        lookAt.copy( pos ).add( dir );
        
        splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
        splineCamera.rotation.setFromRotationMatrix( splineCamera.matrix,   splineCamera.rotation.order );



        parent.rotation.y += ( targetRotation - parent.rotation.y ) * 0.05;

        renderer.render( scene, splineCamera );
        renderer.setClearColor( 0xf0f0f0 );
    }
}

THREE.Curves = {};


THREE.Curves.KnotCurve = THREE.Curve.create(

	function() {

	},

	function(t) {

		t *= 2 * Math.PI;

		var R = 10;
		var s = 50;
		var tx = s * Math.sin(t),
			ty = Math.cos(t) * (R + s * Math.cos(t)),
			tz = Math.sin(t) * (R + s * Math.cos(t));

		return new THREE.Vector3(tx, ty, tz);

	}

);