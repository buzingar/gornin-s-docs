let obj = { name: "gornin" };
let desc = Object.getOwnPropertyDescriptor(obj, "name");
console.log("desc --> ", desc);
/**
 * {
 *   value: 'gornin',
 *   writable: true,
 *   enumerable: true,
 *   configurable: true
 * }
 */
