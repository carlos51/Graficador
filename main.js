import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
var campos = []
class MathBox{
    static lastElement = "0";
    constructor(padre,nombre){
        //var elemento1 = document.lastElementChild("algebra")
        this.p = document.createElement("p");
        //console.log("padre",document.getElementById(padre))
        this.p.textContent = nombre;
        document.getElementById(padre).appendChild(this.p);

        this.span = document.createElement("span");
        this.span.id = nombre;
        this.span.addEventListener("keydown",function(event){
            //console.log(event)
            if (event.key === 'Enter') {
                // Código que se ejecutará cuando se presione Enter
                //console.log('Se presionó Enter');
                answerMathField.blur();
                campos.push(new MathBox("algebra",(parseInt(nombre)+1).toString()))
              }
        })
        //this.span.oninput = myfun();
        this.p.appendChild(this.span);
        this.geometry;
        var mesh = new THREE.Mesh( this.geometry, material );
        //console.log(this.mesh)
        scene.add( mesh );

        var answerMathField = MQ.MathField(this.span, {
            handlers: {
            edit: function() {
                var enteredMath = answerMathField.latex(); // Get entered math in LaTeX format
                //this.mesh.geometry = checkAnswer(enteredMath);
                try{
                    mesh.geometry = checkAnswer(enteredMath);
                    console.log("latex",enteredMath)
                }catch{}
            }
            }
        });
        answerMathField.focus();
        
    }
}


let camera, scene, renderer, stats;
let gui;

const material = new THREE.MeshPhongMaterial( {
    side: THREE.DoubleSide,
    vertexColors: true
} );
var MQ = MathQuill.getInterface(2);


function checkAnswer(expretion){

    return superficie(expretion)
}

init();
animate();
var answerSpan = new MathBox("algebra","0")


function init() {

    //
    const canvasWidth = window.innerWidth - 400;
    const canvasHeight = window.innerHeight - 51;

    camera = new THREE.PerspectiveCamera( 27, canvasWidth / canvasHeight , 1, 3500 );
    camera.position.z = 20;
    //camera.position.x = 20;
    camera.position.y = 20;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( "white" );

    //
    const light = new THREE.HemisphereLight();
    scene.add( light );

    //
    const axesHelper = new THREE.AxesHelper( 2 );
    scene.add( axesHelper );
    //
    renderer = new THREE.WebGLRenderer( { antialias: true, canvas:my_canvas } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( canvasWidth, canvasHeight);
    //
    
    

    stats = new Stats();
    //document.body.appendChild( stats.dom );
    //
    gui = new GUI();
    gui.add( material, 'wireframe' );
    //document.getElementById("stats").appendChild(gui.domElement);
    
    window.addEventListener( 'resize', onWindowResize );

}
const controls = new OrbitControls( camera, renderer.domElement );
const size = 10;
const divisions = 10;

const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );

function superficie(funcion){
    var fn = evaluatex(funcion)
    const geometry = new THREE.BufferGeometry();

    const indices = [];

    const vertices = [];
    const normals = [];
    const colors = [];

    const size = 10;
    const segments = 50;

    const left = 5
    const right = 5

    const halfSize = size / 2;
    const segmentSize = size / segments;

    const _color = new THREE.Color();
    // generate vertices, normals and color data for a simple grid geometry

    for ( let i = 0; i <= segments; i ++ ) {
        //console.log("sddsda",i * segmentSize)
        const y = ( i * segmentSize ) - halfSize;
        //console.log(y)

        for ( let j = 0; j <= segments; j ++ ) {

            const x = ( j * segmentSize ) - halfSize;

            //vertices.push( x,x*x-y*y, - y );
            //vertices.push( x,math.evaluate(funcion,{x:x,y:y}), - y );
            vertices.push( x,fn({x:x,y:y}), - y );
            normals.push( 0, 0, 1 );

            const r = ( x / size ) + 0.5;
            const g = ( y / size ) + 0.5;

            _color.setRGB( r, g, 1, THREE.SRGBColorSpace );

            colors.push( _color.r, _color.g, _color.b );

        }

    }

    // generate indices (data for element array buffer)

    for ( let i = 0; i < segments; i ++ ) {

        for ( let j = 0; j < segments; j ++ ) {

            const a = i * ( segments + 1 ) + ( j + 1 );
            const b = i * ( segments + 1 ) + j;
            const c = ( i + 1 ) * ( segments + 1 ) + j;
            const d = ( i + 1 ) * ( segments + 1 ) + ( j + 1 );

            // generate two faces (triangles) per iteration

            indices.push( a, b, d ); // face one
            indices.push( b, c, d ); // face two

        }

    }
    geometry.setIndex( indices );
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

    return geometry
}

function onWindowResize() {
    const canvasWidth = window.innerWidth - 400;
    const canvasHeight = window.innerHeight - 51;

    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( canvasWidth, canvasHeight );

}

//

function animate() {
    requestAnimationFrame( animate );
    render();
    //stats.update();
}

function render() {

    renderer.render( scene, camera );

}
