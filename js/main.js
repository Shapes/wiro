function start(){
    var wrapper = document.getElementById('wrapper');
    var scene, camera, renderer;
    var geometry, material, mesh;
    var width=1000, height=600;

    init();
    //animate();

    function init() {

        scene = new THREE.Scene();
        
        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 0, 0, 3 );
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
        //splineCamera.lookAt(-195.21238109169673, 18.160346897694417, -81.49978092684051);
        
        tube = new THREE.TubeGeometry(new THREE.Curves.KnotCurve(), 200, 2, 3, true);
        addGeometry(tube, 0xF4A460);
	    
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( width, height );

        wrapper.appendChild( renderer.domElement );

        renderer.render( scene, splineCamera );
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