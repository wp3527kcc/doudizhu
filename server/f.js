function compare(arr){
    const result = [], counts = [[],[],[]]
    for (let i = 0; i < 18; i++)
        result.push(0)
    arr.forEach(each => result[each]++)
    result.forEach((each,index) => {
        counts.forEach((e,i) => {
            if(each == i+1)
                e.push(index)
        })
    })
    if(result.includes(4)){
        
    }
}
