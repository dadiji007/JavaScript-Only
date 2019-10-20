
let a = 0

// async function b()
let b = async () => {
    a = a+ await 10
    console.log('1',a)
    a = a+ await 10
    console.log('2',a)
}

b()
a++
console.log('3',a)

