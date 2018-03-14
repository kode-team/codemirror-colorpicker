function array_equals (v1, v2) {
    if (v1.length !== v2.length) return false;
    for (var i = 0, len = v1.length; i < len; ++i) {
      if (v1[i] !== v2[i]) return false;
    }
    return true;
}

function euclidean (v1, v2) {
    var total = 0;

    for(var i = 0, len = v1.length; i < len; i++) {
        total += Math.pow(v2[i] - v1[i], 2);
    }

    return Math.sqrt(total);
}

function manhattan (v1, v2) {
    var total = 0;

    for(var i = 0, len = v1.length; i < len; i++) {
        total += Math.abs(v2[i] - v1[i]);
    }

    return total; 
}

function max (v1, v2) {
    var max = 0; 
    for (var i = 0, len = v1.length; i < len; i++) {
        max = Math.max(max, Math.abs(v2[i] - v1[i]));
    }

    return max; 
}



const distances = {
    euclidean,
    manhattan,
    max
}

// 임이의 몇개(k)를 찾는다. 
function randomCentroids (points, k) {
    var centeroids = points.slice(0);

    centeroids.sort(function () {
        return (Math.round(Math.random()) - 0.5);
    })

    return centeroids.slice(0, k);
}

// k 단계 중에 가장 가까운 거리에 있는 index 를 찾아보자. 
function closestCenteroid (point, centeroids, distance) {
    var min = Infinity, index = 0; 

    centeroids.forEach((center, i) => {
        var dist = distance(point, center);

        if (dist < min) {
            min = dist; 
            index = i;
        }
    })

    return index;   // 가장 가까운 k 
}

function getCenteroid (assigned) {

    if (assigned.length === 0) return [];

    // Calculate running means.
    let centeroid = assigned[0].map(it => {
        return 0
    });

    assigned.forEach((it, index) => {

        it.forEach( (item, j) => {
            centeroid[j] += (item - centeroid[j]) / (index + 1);
        })
    })

    return centeroid;
}

function unique_array (arrays) {
    // 배열 중복을 제거 하자.
    var set = {};
    var count = arrays.length; 
    let it = null;
    while(count--) {
        it = arrays[count]; 
        set[JSON.stringify(it)] = it; 
    }

    return Object.values(set);
}


function kmeans (points, k, distance, period = 10) {
    points = unique_array(points);

    k = k || Math.max(2, Math.ceil(Math.sqrt(points.length / 2)));

    distance = distance || 'euclidean';
    if (typeof distance == 'string') {
        distance = distances[distance];
    }

    var rng_seed = 0;
    var random = function() {
      rng_seed = (rng_seed * 9301 + 49297) % 233280;
      return rng_seed / 233280;
    };

    const centeroids = randomCentroids(points, k);
    
    let movement = true;
    let iterations = 0;
    while(movement) {
        let assignment = new Array(k);      // 현재 k 에 할당된 값들 (계속 변경됨)

        for(var i = 0; i < k; i++) {
            assignment[i] = [];
        }

        // 포인트별 그룹 위치 저장 
        points.forEach(point => {
            var index = closestCenteroid(point, centeroids, distance);
            assignment[index].push(point);
        });

        movement = false;   //  한번 실행 했으니 그걸로 끝 ? 


        for(var i = 0; i < k; i++) {
            let assigned = [];

            assignment.forEach((kIndex, index) => {
                if (kIndex == i) { 
                    assigned.push(points[index]);
                }
            })

            // 중심점 구하기 
            const centeroid = centeroids[i];
            let newCenteroid = new Array(centeroid.length);  // 새로운 중심점 생성하기 위한 객체 

            if (assigned.length > 0) {
                newCenteroid = getCenteroid(assigned);
            } else {
                // For an empty cluster, set a random point as the centroid.
                var idx = Math.floor(random() * points.length);
                newCenteroid = points[idx];
            }

            // 그 값이 다르면  루프를 계속 돈다. 마지막으로 같을 때까지 
            if (array_equals(newCenteroid, centeroid)) {
                movement = false; 
            } else {
                movement = true; 
            }          

            // 해당 그룹 k 의 중심 점 교체 
            centeroids[i] = newCenteroid;
        }

        iterations++;

        if (iterations % period == 0) {
            break; 
        }

    }

    return centeroids;
}

export default kmeans
