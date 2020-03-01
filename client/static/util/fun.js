export function judgement(arr) {
    let result, result1, result2, result3, result4
    switch (arr.length) {
        case 1:
            return {
                flag: true, value: arr[0], type: 'SINGLE'
            }
            case 2:
                if (arr[0] == 16 && arr[1] == 17)
                    return {
                        type: 'BOOM',
                        flag: true,
                        value: 100
                    }
                if (new Set(arr).size === 1)
                    return {
                        type: 'DOUBLE',
                        flag: true,
                        value: arr[0]
                    }
                return {
                    flag: false
                }
                case 3:
                    if (new Set(arr).size === 1)
                        return {
                            type: 'TRIPLE',
                            flag: true,
                            value: arr[0]
                        }
                    return {
                        flag: false
                    }
                    case 4:
                        if (new Set(arr).size === 1)
                            return {
                                type: 'BOOM',
                                flag: true,
                                value: arr[0]
                            }
                        if (is3p1(arr).flag)
                            return is3p1(arr)
                        return {
                            flag: false
                        }
                        case 5:
                            if (isSerial(arr).flag)
                                return isSerial(arr)

                            if (is3p2(arr).flag)
                                return is3p2(arr)
                        case 6: //AAABBB AABBCC ABCDEF AAAABC AAAABB
                            result1 = MultiTriple(arr),
                                result3 = EvenPair(arr),
                                result2 = isSerial(arr),
                                result4 = is4p2(arr)
                            if (result1.flag)
                                return result1
                            if (result2.flag)
                                return result2
                            if (result3.flag)
                                return result3
                            if (result4.flag)
                                return result4
                            return {
                                flag: false
                            }
                            case 7:
                                result = isSerial(arr)
                                if (result)
                                    return result
                                return {
                                    flag: false
                                }
                                case 8:
                                    result1 = MultiTriple(arr),
                                        result2 = isSerial(arr),
                                        result3 = EvenPair(arr),
                                        result4 = is4p2(arr)
                                    if (result1.flag)
                                        return result1
                                    if (result2.flag)
                                        return result2
                                    if (result3.flag)
                                        return result3
                                    if (result4.flag)
                                        return result4

                                    return {
                                        flag: false
                                    }
                                    case 9:
                                        result1 = MultiTriple(arr)
                                        if (result1.flag)
                                            return result1
                                        result2 = isSerial(arr)
                                        if (result2.flag)
                                            return result2
                                        return {
                                            flag: false
                                        }
                                        case 10:
                                            result1 = MultiTriple(arr)
                                            if (result1.flag)
                                                return result1
                                            result2 = isSerial(arr)
                                            if (result2.flag)
                                                return result2
                                            result3 = EvenPair(arr)
                                            if (result3.flag)
                                                return result3
                                            return {
                                                flag: false
                                            }
                                            case 11:
                                                result = isSerial(arr)
                                                if (result.flag)
                                                    return result
                                                return {
                                                    flag: false
                                                }
                                                case 12:
                                                    result1 = MultiTriple(arr)
                                                    if (result1.flag)
                                                        return result1
                                                    result2 = EvenPair(arr)
                                                    if (result2.flag)
                                                        return result2
                                                    result3 = isSerial(arr)
                                                    if (result3.flag)
                                                        return result3
                                                    return {
                                                        flag: false
                                                    }
                                                    case 14:
                                                        result = EvenPair(arr)
                                                        if (result.flag)
                                                            return result
                                                        return {
                                                            flag: false
                                                        }
                                                        case 15:
                                                            result = MultiTriple(arr) //aaabbbcccdddeee aaabbbcccddd
                                                            if (result.flag)
                                                                return result
                                                            return {
                                                                flag: false
                                                            }
                                                            case 16:
                                                                result1 = MultiTriple(arr)
                                                                if (result1.flag)
                                                                    return result1
                                                                result2 = EvenPair(arr)
                                                                if (result2.flag)
                                                                    return result2
                                                                return {
                                                                    flag: false
                                                                }
                                                                case 18:
                                                                    result1 = MultiTriple(arr)
                                                                    if (result1.flag)
                                                                        return result1
                                                                    result2 = EvenPair(arr)
                                                                    if (result2.flag)
                                                                        return result2
                                                                    return {
                                                                        flag: false
                                                                    }
                                                                    case 20:
                                                                        result1 = MultiTriple(arr)
                                                                        if (result1.flag)
                                                                            return result1
                                                                        result2 = EvenPair(arr)
                                                                        if (result2.flag)
                                                                            return result2
                                                                        return {
                                                                            flag: false
                                                                        }
                                                                        default:
                                                                            return {
                                                                                flag: false
                                                                            }
    }
}

function Format(arr) {
    const result = []
    for (let i = 0; i < 18; i++)
        result.push(0)
    arr.forEach(each => result[each]++)
    return result
}

function isSerial(arr) {
    let flag = false,
        {
            length
        } = arr,
        a = [15, 16, 17]
    arr.forEach((each, index) => {
        if (each - index != arr[0])
            flag = true
    })
    if (!flag && !a.includes(arr[length - 1]))
        return {
            type: 'SERIAL',
            value: arr[length - 1],
            flag: true,
            length
        }
    return {
        flag: false
    }
}

function is3p1(arr) {
    const result = Format(arr)
    const value = result.indexOf(3)
    if (value != -1 && result.includes(1) && arr.length == 4)
        return {
            flag: true,
            value,
            type: '3p1'
        }
    else
        return {
            flag: false
        }
}

function is3p2(arr) {
    const result = Format(arr)
    const value = result.indexOf(3)
    if (value != -1 && result.includes(2) && arr.length == 5)
        return {
            flag: true,
            value,
            type: '3p2'
        }
    else
        return {
            flag: false
        }
}

function EvenPair(arr) {
    let {
        length
    } = arr, flag = true, result = Format(arr)
    if (result[15] != 0 || result[16] != 0 || result[17] != 0 || length < 6 || length % 2 == 1)
        return {
            flag: false
        }
    for (let i = 0; i < length; i += 2) {
        if (arr[i] != arr[i + 1])
            flag = false
    }
    if (flag && isSerial(arr.filter((each, index) => index % 2 == 0)).flag)
        return {
            'flag': true,
            value: arr[length - 1],
            type: 'EVENPAIR',
            'length': length / 2
        }
    return {
        'flag': false
    }
}

function MultiTriple(arr) {
    let result = Format(arr),
        counts = [
            [],
            [],
            []
        ]
    result.forEach((each, index) => {
        counts.forEach((e, i) => {
            if (each == i + 1)
                e.push(index)
        })
    })
    let {
        length
    } = counts[2]
    if (!isSerial(counts[2]).flag)
        return {
            flag: false
        }
    if (length > 1 && counts[0].length == 0 && counts[1].length == 0)
        return {
            type: 'MULTITRIPLE',
            flag: true,
            value: counts[2][length - 1],
            length
        }
    if (counts[0].length + counts[1].length * 2 == length && length > 1)
        return {
            type: 'MULTITRIPLEp1',
            flag: true,
            value: counts[2][length - 1],
            length
        }
    if (counts[0].length == 0 && counts[1].length == length && length > 1)
        return {
            type: 'MULTITRIPLEp2',
            flag: true,
            value: counts[2][length - 1],
            length
        }
    return {
        flag: false
    }
}

function is4p2(arr) {
    let result = Format(arr),
        counts = [
            [],
            [],
            [],
            []
        ]
    result.forEach((each, index) => {
        counts.forEach((e, i) => {
            if (each == i + 1)
                e.push(index)
        })
    })
    let {
        length
    } = arr
    if (length == 6 && counts[3].length == 1 && counts[0].length + 2 * counts[1].length == 2)
        return {
            flag: true,
            value: counts[3][0],
            type: '4p2'
        }
    if (length == 8 && counts[3].length == 1 && counts[0].length == 0 && counts[1].length == 2)
        return {
            flag: true,
            value: counts[3][0],
            type: '4p4'
        }
    return {
        flag: false
    }
}

// console.log(judgement([5]))//true
// console.log(judgement([13,13]))//true type:double value:13
// console.log(judgement([13,14]))//false
// console.log(judgement([14,15]))//true boom vlaue 100
// console.log(judgement([3,3,3]))//type:TRIPLE true value:3
// console.log(judgement([3,3,1]))//false
// console.log(judgement([3,3,3,1]))//true 3p1 value 3
// console.log(judgement([3,3,3,1,1]))//true 3p2 value 3
// console.log(judgement([3,4,5,6,7]))//true SERIAL
// console.log(judgement([4,4,4,4]))//true boom
// console.log(judgement([4,4,4,5]))//true 3p1
// console.log(judgement([4,4,4,4,5]))//false 
// console.log(judgement([4,4,4,5,5,5]))//false 
// console.log(judgement([4,4,5,5,6,6]))//false 
// console.log(judgement([4,4,5,5,7,7]))//false 
// console.log(judgement([13,13,14,14,15,15]))//false 
// console.log(judgement([12,12,13,13,14,14]))//false 
// console.log(judgement([4,4,4,6,6,6]))//false 
// console.log(judgement([3,4,5,6,7,8]))//false 
// console.log(judgement([3,4,5,6,7,8]))//false 
// console.log(judgement([3, 4, 5, 6, 7, 8])) //false 
export function compare(a1,a2){
    const r1 = judgement(a2)
    if (!r1.flag)
        return false
    if (!a1.length) 
        return true
    const r2 = judgement(a1)
    if(r1.type == r2.type && r1.length==r2.length)
        {
            if(r1.value>r2.value)
                return true
            return false
        }
    if(r1.type == 'BOOM')
        return true
        return false
}   