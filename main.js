import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
var campos = []
class MathBox{
    static lastElement = "0";
    constructor(padre,nombre){
        var self = this;
        this.div = document.createElement("div");
        this.p = document.createElement("p");
        this.p.textContent = nombre + " ";
        this.div.appendChild(this.p)
        document.getElementById(padre).appendChild(this.div);

        this.span = document.createElement("span");
        this.span.id = nombre;
        this.span.className = "entrada";
        this.funcion = "";
        this.span.addEventListener("keydown",function(event){
            if (event.key === 'Enter') {
                // Código que se ejecutará cuando se presione Enter
                self.answerMathField.blur();
                campos.push(new MathBox("entradas",(parseInt(nombre)+1).toString()))
              }
            else if(event.key == "Backspace"){
                let a = self.span.textContent.length
                if ( a == 2){
                    console.log("vacio")
                    self.mesh.visible = false
                }
                else if(a == 1 && self.span.id != "0"){
                    let index = parseInt(self.span.id)-1
                    self.p.remove()
                    scene.remove(self.mesh)
                    campos.splice(index,1)
                    if (index-1 >= 0){
                        campos[index-1].answerMathField.focus()
                    }
                    else{
                        answerSpan.answerMathField.focus()
                    }
                }
            }
        })
        this.p.appendChild(this.span);
        this.geometry;
        this.mesh = new THREE.Mesh( this.geometry, material );
        scene.add( this.mesh );

        this.answerMathField = MQ.MathField(this.span, {
            handlers: {
            edit: function() {
                var enteredMath = self.answerMathField.latex(); // Get entered math in LaTeX format
                try{
                    if(!self.mesh.visible && self.span.textContent.length == 2){
                        self.mesh.visible = true
                    }
                    self.mesh.geometry = checkAnswer(enteredMath);
                    console.log("campos",campos)
                    self.funcion = enteredMath;
                }catch{}
            }
            }
        });
        this.answerMathField.focus();
        
    }
    UpdateMesh(){
        console.log("mesh actualizado")
        this.mesh.geometry = checkAnswer(this.funcion);
    }
}

class VectBox{
    static i = [];
    static j = [];
    static k = [];
    static linesh = [];
    static linesv = [];
    constructor(padre, nombre, vector){
        var self = this;
        this.name = nombre;
        this.vector = vector;
        this.UpdateVec();
        this.p = document.createElement("p");
        this.p.textContent = nombre + " ";
        document.getElementById(padre).appendChild(this.p);

        this.span = document.createElement("span");
        this.span.id = this.name;
        this.span.className = "entradav"
        this.span.addEventListener("keydown",function(event){
            if (event.key === 'Enter') {
                // Código que se ejecutará cuando se presione Enter
                self.answerMathField.blur();
              }
        })
        this.p.appendChild(this.span);


        this.answerMathField = MQ.MathField(this.span, {
            handlers: {
            edit: function() {
                var enteredMath = self.answerMathField.latex(); // Get entered math in LaTeX format
                var ascii = latex_to_js(enteredMath);
                var arreglo;
                try{

                    arreglo = JSON.parse(ascii);
                    self.vector = arreglo;
                    self.UpdateVec();
                    
                    if(arreglo.length == 3){
                        updateGrid(5,VectBox.i,VectBox.j,VectBox.k);
                        answerSpan.UpdateMesh();

                    }
                }catch{}
                
            }
            }
        });
        this.answerMathField.write("\\left["+this.vector.toString()+"\\right]");
    }
    UpdateVec(){
        if (this.name == "i"){
            VectBox.i = this.vector;
        }
        else if(this.name == "j"){
            VectBox.j = this.vector;
        }
        else{
            VectBox.k = this.vector;
        }
    }
}

function grid(i,j,k){
    //console.log(i);
    const m = setMatrix(i,j,k);
        let n = 5
        for (let i = -n;i <= n; i++){
            
            // Paso 2: Crea un material para la línea
            var material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

            // Paso 3: Define los puntos de inicio y fin de la línea
            var startPoint = new THREE.Vector3(-i, 0, -n);
            var endPoint = new THREE.Vector3(-i, 0, n);

            var startPoint2 = new THREE.Vector3(-n, 0, -i);
            var endPoint2 = new THREE.Vector3(n, 0, -i);
            //var test = new THREE.Vector3(0, 0, 0);


            var points = [startPoint.applyMatrix3(m), endPoint.applyMatrix3(m)];
            var points2 = [startPoint2.applyMatrix3(m), endPoint2.applyMatrix3(m)];

            //console.log(startPoint.add(endPoint))

            // Paso 4: Crea la geometría de la línea usando los puntos definidos
            var geometry = new THREE.BufferGeometry().setFromPoints(points);
            var geometry2 = new THREE.BufferGeometry().setFromPoints(points2);

            // Paso 5: Crea la instancia de la línea con la geometría y el material
            var line = new THREE.Line(geometry, material);
            var line2 = new THREE.Line(geometry2, material);

            // Paso 6: Agrega la línea a la escena
            VectBox.linesh.push(line);
            VectBox.linesv.push(line2);
            scene.add(line);
            scene.add(line2);
        }

    
}
function setMatrix(i,j,k){
    const m = new THREE.Matrix3();
    m.set(  
        i[0], k[0], j[0],
        i[2], k[2], j[2],
        i[1], k[1], j[1] 
    );
    return m
}
function updateGrid(n,i,j,k){
    const m = setMatrix(i,j,k);
    let count = 0
    for (let i = -n; i <= n; i++) {
        
        // Paso 3: Define los puntos de inicio y fin de la línea
        var startPoint = new THREE.Vector3(-i, 0, -n);
        var endPoint = new THREE.Vector3(-i, 0, n);

        var startPoint2 = new THREE.Vector3(-n, 0, -i);
        var endPoint2 = new THREE.Vector3(n, 0, -i);

        var points = [startPoint.applyMatrix3(m), endPoint.applyMatrix3(m)];
        var points2 = [startPoint2.applyMatrix3(m), endPoint2.applyMatrix3(m)];

        VectBox.linesh[count].geometry.setFromPoints(points)
        VectBox.linesv[count].geometry.setFromPoints(points2)

        count ++;
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

//var test = new VectBox("vectores", "test")

var vectI = new VectBox("vectores", "i",[1,0,0]);
var vectJ = new VectBox("vectores", "j",[0,1,0]);
var vectK = new VectBox("vectores", "k",[0,0,1]);

//grid(vectI.vector, vectJ.vector, vectK.vector)

var answerSpan = new MathBox("entradas","0");


function init() {

    //
    const canvasWidth = window.innerWidth - 400;
    const canvasHeight = window.innerHeight - 51;

    camera = new THREE.PerspectiveCamera( 27, canvasWidth / canvasHeight , 1, 3500 );
    camera.position.z =10;
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

//const gridHelper = new THREE.GridHelper( size, divisions );
//scene.add( gridHelper );

function superficie(funcion){
    console.log(funcion);
    var fn = evaluatex(funcion);
    var m = setMatrix(vectI.vector,vectJ.vector, vectK.vector);
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
        const x = ( i * segmentSize ) - halfSize;

        for ( let j = 0; j <= segments; j ++ ) {

            const y = ( j * segmentSize ) - halfSize;
            const vector = new THREE.Vector3(x,fn({x:x,y:y}), -y)
            //const vector = new THREE.Vector3(x, -y, fn({x:x,y:-y}))

            vector.applyMatrix3(m)
            vertices.push(vector)
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
    //geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geometry.setFromPoints(vertices)
    geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

    return geometry
}

function onWindowResize() {
    const canvasWidth = window.innerWidth - 400;
    const canvasHeight = window.innerHeight - 51;

    document.getElementById("entradas").style.height = window.innerHeight - 80

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
