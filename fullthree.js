/*fullthree.js - worldbuilding with three.js and .obj filetype*/

const k = 1000;
    var camera, scene, renderer;
    var geometry, material, loader;
    var clock;
    var dir=1;

    //temp variable toggle for the camera tracking
    var toggle = 1;


        function init() {
            renderer = new THREE.WebGLRenderer();
            renderer.setClearColor(0xffffff,1);
            renderer.setSize( window.innerWidth, window.innerHeight );
            document.body.appendChild( renderer.domElement );

            scene = new THREE.Scene();

            const light = new THREE.AmbientLight( 0x909090); // soft white light
            scene.add( light );

            //Add Bounds of the map
            geometry = new THREE.SphereGeometry( Math.PI*k, k, k);
            loader = new THREE.TextureLoader();
            material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.BackSide, map: loader.load('https://raw.githubusercontent.com/LuckyNate/FullThree/main/images/seascape.png')});
            skybox = new THREE.Mesh(geometry, material);

            //Add water at 0 altitude
            geometry = new THREE.CylinderGeometry( 1.2*k, 1*k, 1*k, 1*k);
            material = new THREE.MeshStandardMaterial( {color: 0x2c7db6, side: THREE.DoubleSide} );
            waterbox = new THREE.Mesh( geometry, material );
            waterbox.translateY(-0.5*k);
            scene.add( waterbox);
            
            //add player avatar
            geometry = new THREE.ConeGeometry( 0.1, 0.5, 32 );
            material = new THREE.MeshStandardMaterial( {color: 0x00ff00, side: THREE.FrontSide} );
            player= new THREE.Mesh( geometry, material );
            player.geometry.rotateX(Math.PI/2);
            player.position.set(0, 1.5, 0);
            scene.add( player );

            geometry = new THREE.SphereGeometry( 0.25, 32,32 );
            material = new THREE.MeshStandardMaterial( {color: 0xff0000, side: THREE.FrontSide} );
            target= new THREE.Mesh( geometry, material );
            target.position.set(0, 1.6, 10)
            scene.add( target );

            
            camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, Math.PI * 2 * k);
            camera.position.set ( player.position.x-0.5, 1.6, player.position.z-0.5);
            camera.lookAt(target.position);
            player.lookAt(target.position);

            skybox.translateY(2.9275*k);
            scene.add( skybox);

            clock = new THREE.Clock();

            window.addEventListener( 'resize', onWindowResize, false );

            document.addEventListener('mousemove', onDocumentMouseMove, false);

            function onDocumentMouseMove(event) {
                event.preventDefault();
                mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
                
                target.position.set(mouseX * 10, mouseY * 10, 10);
                camera.lookAt(target.position);
                player.lookAt(target.position);
            }

            window.addEventListener('wheel', function(){
                var e = event;
                if(e.deltaY < 0){
                    camera.position.distanceTo(player.position ) > 1.0
                        ? camera.translateZ(-0.5)
                        : camera.translateZ(0);
                }
                else {
                    camera.position.distanceTo( player.position ) < 5.0
                        ? camera.translateZ(+0.5)
                        : camera.translateZ(0);
                }
                camera.lookAt(player.position.x, player.position.y, player.position.z+10);
            }, false);

        }
        
        
        function animate() {
            requestAnimationFrame(animate);
            var delta = clock.getDelta();
            var playerPosition = player.position.clone();
            var targetPosition = target.position.clone();
            var eyeTarget = playerPosition.lerp(targetPosition, 0.5);
          
            camera.position.lerp(eyeTarget.clone().sub(new THREE.Vector3(0, 0, 1)), 0.1);
            camera.lookAt(eyeTarget);
          
            renderer.render(scene, camera);
          }

        function onWindowResize() {

                windowHalfX = window.innerWidth / 2;
                windowHalfY = window.innerHeight / 2;

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize( window.innerWidth, window.innerHeight );

        }
        
        window.addEventListener("DOMContentLoaded", function(event) {
            init();
            animate();
        });
        
/*authored by LuckyNate, 2022*/

