import React, { useState } from 'react'
import { Button, Space, Card, Avatar, Menu, Dropdown } from 'antd'
import classNames from 'classnames'
import router from 'umi/router'
import { EllipsisOutlined } from '@ant-design/icons'
import Layout from '../components/Layout'
import PostList from '../components/PostList'
import Create from '../components/Create'
import CreateGroup from '../components/Group/CreateGroup'
import GroupManager from '../components/GroupManager'
import InviteMember from './InviteMember'
import DissolveGroup from './DissolveGroup'
import ShareGroup from './ShareGroup'
import sty from './styles.less'

const a = `一道加法计算题: ${1 + 1}, 请求出它的结果`

const titleMap = {
  '01': '一月课程计划',
  '02': '二月课程计划',
  '03': '三月课程计划',
  '04': '四月课程计划',
  '05': '五月课程计划',
  '06': '六月课程计划',
  '07': '七月课程计划',
  '08': '八月课程计划',
  '09': '九月课程计划',
  '10': '十月课程计划',
  '11': '十一月课程计划',
  '12': '十二月课程计划',
}

const tabList = [
  {
    key: 'all',
    tab: '全部',
  },
  {
    key: 'post',
    tab: '帖子',
  },
  {
    key: 'ask',
    tab: '问答'
  },
  {
    key: 'article',
    tab: '文章',
  },
  {
    key: 'manager',
    tab: '只看圈主'
  }
]

const Group = () => {
  const [open, setOpen] = useState({
    update: false,
    invite: false,
    dissolve: false,
    share: false
  })
  const [tab, setTab] = useState('all')
  const [activeLabel, setActiveLabel] = useState('latest')

  const menu = (
    <Menu
      onClick={({ key }) => {
        switch (key) {
          case 'dissolve':
            setOpen(state => ({ ...state, dissolve: true }))
            break;
          case 'share':
            setOpen(state => ({ ...state, share: true }))
            break;
          default:
            break;
        }
      }}
      items={[
        {
          key: 'share',
          label: '分享圈子',
        },
        {
          key: 'dissolve',
          label: '解散圈子',
        },
      ]}
    />
  )

  return (
    <>
      <Layout
        side={
          <>
            <Create />
            <GroupManager />

            <Card
              title='成员列表'
              bordered={false}
              bodyStyle={{ padding: 0 }}
              extra={
                <span
                  style={{
                    fontSize: 12,
                    cursor: 'pointer',
                    color: 'rgba(0, 0, 0, .35)'
                  }}
                  onClick={() => router.push('/community/group/1/member')}
                >
                  管理 { tab } {`${1 + 1}`} 1234
                </span>
              }
            >
              <div className={sty.member}>
                <Avatar size={40} className={sty.avatar} />
                <p className={sty.memberName}>xxx</p>
                <p className={sty.memberDepartment}>xxxxxx 部门</p>
                <span className={sty.manager}>圈主</span>
                <time className={sty.time}>2022/10/20</time>
              </div>

              <div className={sty.member}>
                <Avatar size={40} className={sty.avatar} />
                <p className={sty.memberName}>xxx</p>
                <p className={sty.memberDepartment}>xxxxxx 部门</p>
              </div>

              <div className={sty.member}>
                <Avatar size={40} className={sty.avatar} />
                <p className={sty.memberName}>xxx</p>
                <p className={sty.memberDepartment}>xxxxxx 部门</p>
              </div>
            </Card>
          </>
        }
      >
        <div className={sty.baseInfo}>
          <img className={sty.cover} alt='' src='https://placehold.co/100x100' />
          <p className={sty.name}>IT</p>
          <Dropdown
            overlay={menu}
          >
            <Button icon={<EllipsisOutlined />} className={sty.more} type='text' shape='circle' />
          </Dropdown>
          <p className={sty.intro}>介绍介绍</p>
          <Space className={sty.action}>
            <Button onClick={() => setOpen(state => ({ ...state, update: true }))}>编辑</Button>
            <Button type='primary' onClick={() => setOpen(state => ({ ...state, invite: true }))}>邀请成员</Button>
          </Space>
        </div>
        <div className={sty.specialPost}>
          <p className={sty.postItem}>
            <span className={classNames(sty.label, { [sty.top]: true })}>置顶</span>
            <span className={classNames(sty.label, { [sty.best]: true })}>置顶</span>
            <span className={sty.postType}>文章 •</span>
            agent安装插件报错
          </p>

          <p className={sty.postItem}>
            <span className={classNames(sty.label, { [sty.top]: true })}>置顶</span>
            <span className={classNames(sty.label, { [sty.best]: true })}>置顶</span>
            <span className={sty.postType}>问答 •</span>
            agent安装插件报错
          </p>
        </div>

        <PostList
          activeTab={tab}
          tabList={tabList}
          onTabChange={key => setTab(key)}
          activeLabel={activeLabel}
          onLabelChange={key => setActiveLabel(key)}
        />
      </Layout>

      <CreateGroup open={open.update} onCancel={() => setOpen(state => ({ ...state, update: false }))} />
      <InviteMember open={open.invite} onCancel={() => setOpen(state => ({ ...state, invite: false }))} />
      <DissolveGroup open={open.dissolve} onCancel={() => setOpen(state => ({ ...state, dissolve: false }))} />
      <ShareGroup open={open.share} onCancel={() => setOpen(state => ({ ...state, share: false }))} />
    </>
  )
}

export default Group
