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

function randomCentroids (points, k) {
    var centeroids = points.slice(0);

    centeroids.sort(function () {
        return (Math.round(Math.random()) - 0.5);
    })

    return centeroids.slice(0, k); 
}

function closestCenteroid (point, centeroids, distance) {
    var min = Infinity, kIndex = 0; 

    centeroids.forEach((center, i) => {
        var dist = distance(point, center);

        if (dist < min) {
            min = dist; 
            kIndex = i;
        }
    })

    return kIndex; 
}

function getCenteroid (assigned) {

    if (!assigned.length) return [];

    // initialize centeroid list 
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
    var set = {};
    var count = arrays.length; 
    let it = null;
    while(count--) {
        it = arrays[count]; 
        set[JSON.stringify(it)] = it; 
    }

    return Object.values(set);
}

function kmeans (points, k, distanceFunction, period = 10) {
    points = unique_array(points);

    k = k || Math.max(2, Math.ceil(Math.sqrt(points.length / 2)));

    let distance = distanceFunction || 'euclidean';
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
        let assignment = new Array(k); 

        for(var i = 0; i < k; i++) {
            assignment[i] = [];
        }

        points.forEach(point => {
            var index = closestCenteroid(point, centeroids, distance);
            assignment[index].push(point);
        });

        movement = false;  

        for(var i = 0; i < k; i++) {
            let assigned = [];

            assignment.forEach((kIndex, index) => {
                if (kIndex == i) { 
                    assigned.push(points[index]);
                }
            })

            const centeroid = centeroids[i];
            let newCenteroid = new Array(centeroid.length);  

            if (assigned.length > 0) {
                newCenteroid = getCenteroid(assigned);
            } else {
                var idx = Math.floor(random() * points.length);
                newCenteroid = points[idx];
            }

            if (array_equals(newCenteroid, centeroid)) {
                movement = false; 
            } else {
                movement = true; 
            }          

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
