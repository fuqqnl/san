/**
 * @file 初始化 element 节点的必须属性
 * @author errorrik(errorrik@gmail.com)
 */

var LifeCycle = require('./life-cycle');

/**
 * 初始化 element 节点的必须属性
 *
 * @param {Object} element 节点对象
 */
function elementInitProps(element) {
    element.lifeCycle = LifeCycle.start;
    element.children = [];
    element._elFns = {};
}

exports = module.exports = elementInitProps;
