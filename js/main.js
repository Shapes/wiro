function start(){
    var wrapper = document.getElementById('wrapper');
    var scene, camera, renderer;
    var geometry, material, mesh;
    var width=1000, height=600;

    init();
    animate();

    function init() {

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, width / height, 1, 10000 );
        camera.position.z = 1000;

        geometry = new THREE.BoxGeometry( 400, 400, 400 );
        material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: false } );

        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( width, height );

        wrapper.appendChild( renderer.domElement );

    }

    function animate() {

        requestAnimationFrame( animate );

        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;

        renderer.render( scene, camera );

    }
}