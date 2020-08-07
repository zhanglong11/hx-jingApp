import toTree from '@/utils/toTree'
import toFlat from '@/utils/toFlat'
import _ from 'lodash'

export default function(flatList, fn) {
  const treeData = toTree(flatList)
  const flatData = toFlat(treeData)
  const dict = _.keyBy(flatData, 'id')
  const allowItemList = flatData.filter(e => fn(e))
  const allowAncestors = _.chain(allowItemList)
    .map(e => e.ancestorIds)
    .flatten()
    .map(id => dict[id])
    .value()
  return toTree(_.union(_.compact(allowItemList.concat(allowAncestors))))
}
