/**
 * if collid return true, or return false
 * @param {p5.Vector} node 
 * @param {p5.Vector} line_node1 
 * @param {p5.Vector} line_node2 
 */
function nodeLineIntersectionCheck(node, line_node1, line_node2) {

    let x1 = 0;
    let y1 = 0;

    let x2 = node.x;
    let y2 = node.y;

    let x3 = line_node1.x;
    let y3 = line_node1.y;

    let x4 = line_node2.x;
    let y4 = line_node2.y;

    let T = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    let U = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    if (T >= 0 && T <= 1 && U >= 0 && U <= 1) {
        return true;
    }

    return false;
}

/**
 * if collid return the nearest vertical project point, or return false
 * @param {p5.Vector} node 
 * @param {PolyGround} polyground 
 */
function nodePolyGroundCollisionDetect(node, polyground) {

    let edge_num = polyground.end_point_array.length;

    if (edge_num <= 1)
        return false;

    let collid_num = 0;
    let nearest_distance_array = [];

    // check each edge
    for (let i = 1; i < edge_num; i++) {

        if (nodeLineIntersectionCheck(node, polyground.end_point_array[i - 1], polyground.end_point_array[i]))
            collid_num++;
    }

    if (nodeLineIntersectionCheck(node, polyground.end_point_array[0], polyground.end_point_array[edge_num - 1]))
        collid_num++;

    // 
    // does collid
    if (collid_num % 2 == 1) {
        
        //console.log("collid !");

        // find the vertical project point on nearest edge
        function verticalProjectPoint(node, line_node1, line_node2) {

            let AB = p5.Vector.sub(line_node2, line_node1);
            let AC = p5.Vector.sub(node, line_node1);
            let AD = p5.Vector.mult(AB, AC.dot(AB) / Math.pow(AB.mag(), 2));

            return p5.Vector.add(line_node1, AD);
        }

        // record the distance to each edge and its vertical project point
        for (let i = 1; i < edge_num; i++) {

            let vp_point = verticalProjectPoint(node, polyground.end_point_array[i - 1], polyground.end_point_array[i]);

            let diff_vec = p5.Vector.sub(node, vp_point);

            nearest_distance_array.push([diff_vec.mag(), vp_point]);
        }
        {
            let vp_point = verticalProjectPoint(node, polyground.end_point_array[0], polyground.end_point_array[edge_num - 1]);

            let diff_vec = p5.Vector.sub(node, vp_point);

            nearest_distance_array.push([diff_vec.mag(), vp_point]);
        }

        let curr_nearest_dist = nearest_distance_array[0][0];
        let rlt_idx = 0;

        for (let i = 0; i < nearest_distance_array.length; i++) {

            if (nearest_distance_array[i][0] < curr_nearest_dist) {
                curr_nearest_dist = nearest_distance_array[i][0];
                rlt_idx = i;
            }
        }

        return nearest_distance_array[rlt_idx][1];
    }
    // NOT collid
    else {

        //console.log("Not collid");

        return false;
    }
}