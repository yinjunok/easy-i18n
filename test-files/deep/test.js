/**
 * 导入语句
*/
import React from 'react'

/**
 * 模板字符串
*/
const template = `
  在编写 Web 代码时，${variable}
  有许多 Web API 可供调用。${o.prop}
  下面是开发 Web 应用程序或 ${fnCall('params')}
  网站时可能使用的所有 API 和接口（对象类型）的列表。 ${num1 + num2}
`

/**
 * 函数调用
*/
fnCall('函数调用')

/**
 * 函数声明
*/
const fnStatement = (p1 = '默认参数') => {}

/**
 * 对象
*/
const obj = {
  'props1': 'props1',
  props2: 2
}

/**
 * 数组
 */
const arr = [
  '字符串',
  { props: 'props' },
  { key: 'all', tab: '全部', },
]

/**
 * 函数定义
*/
const fn = (p1 = 'string', p2 = '提示') => {
  switch (type) {
    case 'case1':
      break;
    case '案例2':
      break;
    default:
      break;
  }
}

/**
 * JSX
*/
const jsx = (
  <div
    className='class'
    onClick={() => { }}
    // jsx 属性
    title='title'
    id={'id'}
  >
    在编写 Web 代码时，{variable}
    有许多 Web API 可供调用。{o.prop}
    下面是开发 Web 应用程序或 {fnCall('params')}
    网站时可能使用的所有 API 和接口（对象类型）的列表。 {num1 + num2}
    {`Fetch 提供了对 ${Request} 和 ${Response}（以及其他与网络请求有关的）对象的通用定义`}
    <div className={sty.member}>
      <Avatar size={40} className={sty.avatar} />
      <p className={sty.memberName}>xxx</p>
      <p className={sty.memberDepartment}>xxxxxx 部门</p>
    </div>
  </div>
)
