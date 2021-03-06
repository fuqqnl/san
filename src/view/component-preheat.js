/**
 * @file 组件预热
 * @author errorrik(errorrik@gmail.com)
 */

var ExprType = require('../parser/expr-type');
var each = require('../util/each');
var handleProp = require('./handle-prop');
var getANodeProp = require('./get-a-node-prop');

/**
 * 组件预热，分析组件aNode的数据引用等信息
 *
 * @param {Function} ComponentClass 组件类
 */
function componentPreheat(ComponentClass) {
    var stack = [];

    function analyseANodeHotspot(aNode) {
        if (!aNode.hotspot) {
            stack.push(aNode);
            aNode.hotspot = {
                data: {}
            };

            if (aNode.textExpr) {
                recordHotspotData(analyseExprDataHotspot(aNode.textExpr));
            }
            else {
                // === analyse hotspot data: start
                each(aNode.vars, function (varItem) {
                    recordHotspotData(analyseExprDataHotspot(varItem.expr));
                });

                each(aNode.props, function (prop) {
                    recordHotspotData(analyseExprDataHotspot(prop.expr));
                });

                /* eslint-disable guard-for-in */
                for (var key in aNode.directives) {
                    var directive = aNode.directives[key];
                    recordHotspotData(analyseExprDataHotspot(directive.value));
                }
                /* eslint-enable guard-for-in */

                each(aNode.elses, function (child) {
                    analyseANodeHotspot(child);
                });

                each(aNode.children, function (child) {
                    analyseANodeHotspot(child);
                });
                // === analyse hotspot data: end


                // === analyse hotspot props: start
                aNode.hotspot.dynamicProps = [];
                aNode.hotspot.staticAttr = '';
                aNode.hotspot.props = {};

                each(aNode.props, function (prop, index) {
                    aNode.hotspot.props[prop.name] = index;

                    if (prop.expr.value != null
                        && !/^(template|input|textarea|select|option)$/.test(aNode.tagName)
                    ) {
                        aNode.hotspot.staticAttr += handleProp.attr(aNode, prop.name, prop.expr.value) || '';
                    }
                    else {
                        aNode.hotspot.dynamicProps.push(prop);
                    }
                });

                // ie 下，如果 option 没有 value 属性，select.value = xx 操作不会选中 option
                // 所以没有设置 value 时，默认把 option 的内容作为 value
                if (aNode.tagName === 'option'
                    && !getANodeProp(aNode, 'value')
                    && aNode.children[0]
                ) {
                    var valueProp = {
                        name: 'value',
                        expr: aNode.children[0].textExpr
                    };
                    aNode.props.push(valueProp);
                    aNode.hotspot.dynamicProps.push(valueProp);
                    aNode.hotspot.props.value = aNode.props.length - 1;
                }
                // === analyse hotspot props: end
            }

            stack.pop();
        }
    }

    function recordHotspotData(refs) {
        each(stack, function (aNode) {
            each(refs, function (ref) {
                aNode.hotspot.data[ref] = 1;
            });
        });
    }

    analyseANodeHotspot(ComponentClass.prototype.aNode);
}

/**
 * 分析表达式的数据引用
 *
 * @param {Object} expr 要分析的表达式
 * @return {Array}
 */
function analyseExprDataHotspot(expr) {
    var refs = [];

    function analyseExprs(exprs) {
        each(exprs, function (expr) {
            refs = refs.concat(analyseExprDataHotspot(expr));
        });
    }

    switch (expr.type) {
        case ExprType.ACCESSOR:
            var paths = expr.paths;
            refs.push(paths[0].value);

            if (paths.length > 1) {
                if (!paths[1].value) {
                    refs.push(paths[0].value + '.*');
                }
                else {
                    refs.push(paths[0].value + '.' + paths[1].value);
                }
            }

            analyseExprs(paths.slice(1));
            break;

        case ExprType.UNARY:
            return analyseExprDataHotspot(expr.expr);

        case ExprType.TEXT:
        case ExprType.BINARY:
        case ExprType.TERTIARY:
            analyseExprs(expr.segs);
            break;

        case ExprType.INTERP:
            refs = analyseExprDataHotspot(expr.expr);

            each(expr.filters, function (filter) {
                analyseExprs(filter.name.paths);
                analyseExprs(filter.args);
            });

            break;

    }

    return refs;
}

exports = module.exports = componentPreheat;
