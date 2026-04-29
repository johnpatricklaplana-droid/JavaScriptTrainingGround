const products = [
    { id: 1, name: "Laptop" },
    { id: 2, name: "Phone" }
];

const transformedOne = products.map(prod => prod.id);

console.log(transformedOne);