// Tiny example lib
export function hello(name = "world") {
    return `Hello, ${name}!`;
}

/*TakeOff leverages Stencil’s compile-time optimizations—native Web Components, automatic code-splitting, and minimal runtime—to keep your apps lean and scalable.*/
hello("TakeOff");


thereisBug();