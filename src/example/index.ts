import LsThree from "../package";

let topProps = {
  x: -60,
  y: -40,
  width: 120,
  height: 80,
  depth: 3,
  radius: 5,
};

const tableModel = new LsThree({
  helper: true,
}).mount("app");

let defaultMaterial = {
  url: "./assets/m1.jpg",
};

const objConfig = {
  scale: {
    x: 0.4,
    y: 0.4,
    z: 0.4
  },
  position: {
    x: 0,
    y: 3,
    z: 0,
  },
  rotate: {
    x: 0,
    y: 1,
    z: 0
  }
}

tableModel.renderOBJ("demo", "./assets/male02.obj", objConfig, "./assets/male02.mtl")

tableModel.createTopMaterial(defaultMaterial).then(() => {
  tableModel.renderTableTop(topProps, 'default')
});
