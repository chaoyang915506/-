<template>
  <div id="submarine" class="submarine"></div>
</template>

<script>
let camera, scene, renderer, mesh;
export default {
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
    };
  },
  created() {
    // setTimeout(() => {
    //   this.init();
    // }, 1000);
    // // this.init();
    // setTimeout(() => {
    //   this.animate();
    // }, 2000);
  },
  methods: {
    animate() {
      requestAnimationFrame(this.animate);
      // mesh.rotation.x += 0.01;
      this.mesh.rotation.y += 0.002;
      // console.log(mesh.rotation)
      this.renderer.render(this.scene, this.camera);
    },
    init() {
      let self = this;

      // const container1 = document.createElement("div");
      const container = document.getElementById("submarine");
      // console.log("container1", container1, "container", container);
      // document.body.appendChild(con);
      // setTimeout(() => {
      //   console.log("thre123e", window.THREE);
      // }, 2000);
      // console.log("thre123e", window.THREE);
      this.camera = new window.THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.25,
        20
      );
      this.camera.position.set(0, 0, 3);

      this.scene = new window.THREE.Scene();

      const envmap = new window.THREE.TextureLoader().load(
        "model/env.jpg",
        function (texture) {
          const loader = new window.GLTFLoader().setPath("model/");
          loader.load("dun.gltf", function (gltf) {
            console.log(gltf);
            self.mesh = gltf.scene.children[0];
            // gltf.scene.traverse(function (child) {
            //   if (child.type === "Object3D") {
            //   	mesh = child
            //   }
            //   if (child.name == 'outer' || child.name == 'mask') {
            //     child.material.envMap = texture
            //     child.material.envMap.mapping =
            //       THREE.EquirectangularReflectionMapping
            //     child.material.envMapIntensity = 2
            //   } else if (child.name == 'body') {
            //     var map = child.material.map
            //     child.material = new THREE.MeshToonMaterial({ map: map })
            //   }
            // })

            self.scene.add(gltf.scene);
            self.render();
          });
        }
      );

      let ambientLight = new window.THREE.AmbientLight(0xffffff, 1); //环境光的颜色以及强弱
      this.scene.add(ambientLight);

      this.renderer = new window.THREE.WebGLRenderer({ antialias: true });
      // console.log("renderer", renderer);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      container.appendChild(this.renderer.domElement);

      const controls = new window.OrbitControls(
        this.camera,
        this.renderer.domElement
      );
      controls.addEventListener("change", this.render); // use if there is no animation loop
      controls.minDistance = 2;
      controls.maxDistance = 10;
      controls.target.set(0, 0, -0.2);
      controls.update();

      window.addEventListener("resize", this.onWindowResize);
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.render();
    },

    render() {
      this.renderer.render(this.scene, this.camera);
    },
  },
};
</script>

<style lang="scss" scoped>
#submarine {
  width: calc(100% / 3 * 1);
  height: calc(100%);
  background-color: red;
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
