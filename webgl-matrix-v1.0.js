/**
	Arrowhead Co. - WebGL Matrix Library v1.0

	>>> Helps with handling and creating matrices.
	>>> All matrices are 4x4 by default.
**/

	/*GLOBALS*/

//Defines a 4x4 matrix
//
var Matrix = function(
	a1, b1, c1, d1,
	a2, b2, c2, d2,
	a3, b3, c3, d3,
	a4, b4, c4, d4){
	
	this.id = "matrix4x4";

	//Just in case
	//
	if(arguments.length !== 16 &&
	   arguments.length !== 1){
		console.error("ERROR: Incorrect number of arguments at matrix4x4.");

		return false;
	}

	//Different cases of user input
	//
	if(typeof arguments[0] === "number"){
		this.value = new Float32Array(16);

		this.value[ 0] = a1;
		this.value[ 1] = b1;
		this.value[ 2] = c1;
		this.value[ 3] = d1;

		this.value[ 4] = a2;
		this.value[ 5] = b2;
		this.value[ 6] = c2;
		this.value[ 7] = d2;

		this.value[ 8] = a3;
		this.value[ 9] = b3;
		this.value[10] = c3;
		this.value[11] = d3;

		this.value[12] = a4;
		this.value[13] = b4;
		this.value[14] = c4;
		this.value[15] = d4;
	} else {
		this.value = arguments[0];
	}

	return this;
};

	/*METHODS*/

//Adds a matrix to current value
//
Matrix.prototype.add = function(matrix){
	for(let i = 0; i < this.value.length; i++){
		this.value[i] += matrix.value[i];
	}

	return this.value;
};

//Subtracts a matrix from current value
//
Matrix.prototype.sub = function(matrix){
	for(let i = 0; i < this.value.length; i++){
		this.value[i] -= matrix.value[i];
	}

	return this.value;
};

//Scales a matrix
//
Matrix.prototype.xScalar = function(scalar){
	for(let i = 0; i < this.value.length; i++){
		this.value[i] *= scalar;
	}

	return this.value;
};

//Multiples two matrices
//
Matrix.prototype.xMatrix = function(matrix){
	var product = new Float32Array(16);

	for(let i = 0; i < 4; i++){
		for(let j = 0; j < 4; j++){

			//Computes each element
			//
			product[(i << 2) + j] = 
				this.value[i * 4 + 0] * matrix.value[j +  0] + 
				this.value[i * 4 + 1] * matrix.value[j +  4] + 
				this.value[i * 4 + 2] * matrix.value[j +  8] + 
				this.value[i * 4 + 3] * matrix.value[j + 12];
		}
	}

	this.value = product;

	return this.value;
};

	/*STATICS*/

//Creates a new identity matrix
//
Matrix.identity = function(){
	var identity = new Matrix(1, 0, 0, 0,
							  0, 1, 0, 0,
							  0, 0, 1, 0,
							  0, 0, 0, 1);

	return identity;
};

//Creates a new rotation matrix along the x-axis
//
Matrix.rotateX = function(angle){
	
	let rotation = new Float32Array(16);

	for(let i = 0; i < 16; i++){
  		rotation[i] = 0;
  	}
	
	//Defines rotation matrix
	//
	rotation[ 0] =  1;
	rotation[ 5] =  Math.cos(angle);
	rotation[ 6] =  Math.sin(angle);
	rotation[ 9] = -Math.sin(angle);
	rotation[10] =  Math.cos(angle);
	rotation[15] =  1;

	return new Matrix(rotation);
};

//Creates a new rotation matrix along the y-axis
//
Matrix.rotateY = function(angle){
	
	let rotation = new Float32Array(16);

	for(let i = 0; i < 16; i++){
  		rotation[i] = 0;
  	}
	
	//Defines rotation matrix
	//
	rotation[ 0] =  Math.cos(angle);
	rotation[ 2] =  Math.sin(angle);
	rotation[ 5] =  1;
	rotation[ 8] = -Math.sin(angle);
	rotation[10] =  Math.cos(angle);
	rotation[15] =  1;

	return new Matrix(rotation);
};

//Creates a new rotation matrix along the z-axis
//
Matrix.rotateZ = function(angle){
	
	let rotation = new Float32Array(16);

	for(let i = 0; i < 16; i++){
  		rotation[i] = 0;
  	}
	
	//Defines rotation matrix
	//
	rotation[ 0] =  Math.cos(angle);
	rotation[ 1] = -Math.sin(angle);
	rotation[ 4] =  Math.sin(angle);
	rotation[ 5] =  Math.cos(angle);
	rotation[10] =  1;
	rotation[15] =  1;

	return new Matrix(rotation);
};

//Creates a new rotation matrix
//
Matrix.rotate = function(x, y, z){
	let rotation = new Float32Array(16);

	let cz = Math.cos(z),
		cy = Math.cos(y),
		cx = Math.cos(x),

		sz = Math.sin(z),		
		sy = Math.sin(y),
		sx = Math.sin(x);

	//Defines rotation along all axes
	//
	rotation[ 0] = cz * cy;
	rotation[ 1] = cz * sy * sx - sz * cx;
	rotation[ 2] = cz * sy * cx + sz * sx;
	rotation[ 3] = 0;

	rotation[ 4] = sz * cy;
	rotation[ 5] = sz * sy * sx + cz * cx;
	rotation[ 6] = sz * sy * cx - cz * sx
	rotation[ 7] = 0;

	rotation[ 8] = -sy;
	rotation[ 9] = cy * sx;
	rotation[10] = cy * cx;
	rotation[11] = 0;

	rotation[12] = 0; 
	rotation[13] = 0;
	rotation[14] = 0;
	rotation[15] = 1; 

	return new Matrix(rotation);
};

//Creates a translation matrix
//
Matrix.translate = function(x, y, z){

	let translation = new Float32Array(16);

	for(let i = 0; i < 16; i++){
		translation[i] = 0;
	}

	//Defines translation matrix
	//
	translation[0]  = 1;
	translation[5]  = 1;
	translation[10] = 1;
	translation[15] = 1;

	translation[12] = x;
	translation[13] = y;
	translation[14] = z;

	return new Matrix(translation);
};

//Creates a projection matrix from 3D to 2D
Matrix.projection = function(fovy, aspect, zMin, zMax){

	//Defaults
	//
	fovy   = Math.max(0, Math.min(fovy, Math.PI)) || Math.PI / 4;
	zMin   = Math.max(zMin, 1 / (1 << 16))	      || 0.1;
	zMax   = Math.min(zMax, 1 * (1 << 16)) 		  || 1000;
	aspect = 						aspect  	  || 1;

	//Resulting projection matrix
	//
	let projection = new Float32Array(16);
	

	//Set all to zero first
	//
	for(let i = 0; i < 16; i++){
		projection[i] = 0;
	}

	//Define necessary parts
	//
	projection[ 0] = 1.0 / Math.tan(fovy / 2) / aspect;
	projection[ 5] = 1.0 / Math.tan(fovy / 2);
	projection[11] = -1;

	projection[10] = (zMax + zMin) / (zMin - zMax);
	projection[14] = (zMax * zMin) / (zMin - zMax) * 2;
	
	return new Matrix(projection);
};

//Creates a viewing matrix (with respect to camera)
//
Matrix.lookAt = function(location, looking, up){
	let lookAt = new Float32Array(16);
	let magnitude = 0;
  
  	//If too close
  	//
    if(
    	Math.abs(location.x - looking.x) < 0.0001 &&
	    Math.abs(location.y - looking.y) < 0.0001 &&
	    Math.abs(location.z - looking.z) < 0.0001
    ){
    	
    	return Matrix.identity();
  	}
  
  	//Represents the forward direction (where the camera is facing)
  	//
  	let forward = {
  		x : location.x - looking.x,
  		y : location.y - looking.y,
  		z : location.z - looking.z,
  	};

 	magnitude = Math.hypot(forward.x,
 						   forward.y,
 						   forward.z);
  	
  	//Normalize
  	//
  	forward.x /= magnitude;
  	forward.y /= magnitude;
  	forward.z /= magnitude;
  
  	//Represents the x-axis of the camera
  	//
  	let right = {
  		x : up.y * forward.z - up.z * forward.y,
  		y : up.z * forward.x - up.x * forward.z,
  		z : up.x * forward.y - up.y * forward.x,
  	};

  	magnitude = Math.hypot(right.x,
  						   right.y,
  						   right.z);
  	
  	//Normalize or be destroyed
  	//
  	if(!magnitude){
  		right.x *= 0;
  		right.y *= 0;
  		right.z *= 0;
  	} else {
  		right.x /= magnitude;
  		right.y /= magnitude;
  		right.z /= magnitude;
  	}

  	//Represents the up direction of the camera
  	let north = {
  		x : forward.y * right.z - forward.z * right.y,
  		y : forward.z * right.x - forward.x * right.z,
  		z : forward.x * right.y - forward.y * right.x,
  	};

  	magnitude = Math.hypot(north.x,
  						   north.y,
  						   north.z);
  	
  	//Normalize or be destroyed
  	//
  	if(!magnitude){
	    north.x *= 0;
	    north.y *= 0;
	    north.z *= 0;
  	} else {
	    north.x /= magnitude;
	    north.y /= magnitude;
	    north.z /= magnitude;
  	}

  	//Defines matrix components
  	//
	lookAt[ 0] = right.x;
	lookAt[ 1] = north.x;
	lookAt[ 2] = forward.x;
	lookAt[ 3] = 0;

	lookAt[ 4] = right.y;
	lookAt[ 5] = north.y;
	lookAt[ 6] = forward.y;
	lookAt[ 7] = 0;

	lookAt[ 8] = right.z;
	lookAt[ 9] = north.z;
	lookAt[10] = forward.z;
	lookAt[11] = 0;

	lookAt[12] = -(right.x * location.x + 
				   right.y * location.y + 
				   right.z * location.z);
	lookAt[13] = -(north.x * location.x + 
				   north.y * location.y + 
				   north.z * location.z);
	lookAt[14] = -(forward.x * location.x + 
				   forward.y * location.y + 
				   forward.z * location.z);
	lookAt[15] = 1;
	
	return new Matrix(lookAt);
};

//Multiplication with vector
//
Matrix.xVector = function(vector, matrix){
	let result = {
		x : 0,
		y : 0,
		z : 0,
	};

	result.x = vector.x * matrix[ 0] +
			   vector.y * matrix[ 4] +
			   vector.z * matrix[ 8] + 
			   			  matrix[12];

	result.y = vector.x * matrix[ 1] +
			   vector.y * matrix[ 5] +
			   vector.z * matrix[ 9] + 
			   			  matrix[13];

	result.z = vector.x * matrix[ 2] +
			   vector.y * matrix[ 6] +
			   vector.z * matrix[10] +
			   			  matrix[14];

	vector = result;

	return result;
};