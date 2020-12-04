import LsThree from '../package'

let topProps = {
    x: -60,
    y: -40,
    width: 120,
    height: 80,
    depth: 3,
    radius: 5,
};

const tableModel = new LsThree({
    helper: true
}).mount("app");

let defaultMaterial = {
    url: './assets/m1.jpg',
}

tableModel.createTopMaterial(defaultMaterial).then(() => {
    tableModel.renderTableTop(topProps, 'default')
})


