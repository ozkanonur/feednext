import React, { Component } from 'react'
import { Tag, message } from 'antd'
import { connect } from 'dva'
import { formatMessage } from 'umi-plugin-react/locale'
import groupBy from 'lodash/groupBy'
import moment from 'moment'

import { NoticeItem } from '@/models/global'
import NoticeIcon from '../NoticeIcon'
import { CurrentUser } from '@/models/user'
import { ConnectProps, ConnectState } from '@/models/connect'
import styles from './index.less'
import { MessageType } from 'antd/lib/message'

export declare interface GlobalHeaderRightProps extends ConnectProps {
	notices?: NoticeItem[]
	currentUser?: CurrentUser
	fetchingNotices?: boolean
	onNoticeVisibleChange?: (visible: boolean) => void
	onNoticeClear?: (tabName?: string) => void
}

class GlobalHeaderRight extends Component<GlobalHeaderRightProps> {
	componentDidMount(): void {
		const { dispatch } = this.props
		if (dispatch) {
			dispatch({
				type: 'global/fetchNotices',
			})
		}
	}

	changeReadState = (clickedItem: NoticeItem): void => {
		const { id } = clickedItem
		const { dispatch } = this.props
		if (dispatch) {
			dispatch({
				type: 'global/changeNoticeReadState',
				payload: id,
			})
		}
	}

	handleNoticeClear = (title: string, key: string): void => {
		const { dispatch } = this.props
		message.success(
			`${formatMessage({
				id: 'Cleared',
			})} ${title}`,
		)
		if (dispatch) {
			dispatch({
				type: 'global/clearNotices',
				payload: key,
			})
		}
	}

	getNoticeData = (): {
		[key: string]: NoticeItem[]
	} => {
		const { notices = [] } = this.props
		if (notices.length === 0) {
			return {}
		}
		const newNotices = notices.map(notice => {
			const newNotice = {
				...notice,
			}
			if (newNotice.datetime) {
				newNotice.datetime = moment(notice.datetime as string).fromNow()
			}
			if (newNotice.id) {
				newNotice.key = newNotice.id
			}
			if (newNotice.extra && newNotice.status) {
				const color = {
					todo: '',
					processing: 'blue',
					urgent: 'red',
					doing: 'gold',
				}[newNotice.status]
				newNotice.extra = (
					<Tag
						color={color}
						style={{
							marginRight: 0,
						}}
					>
						{newNotice.extra}
					</Tag>
				)
			}
			return newNotice
		})
		return groupBy(newNotices, 'type')
	}

	getUnreadData = (noticeData: {
		[key: string]: NoticeItem[]
	}): {
		[key: string]: number
	} => {
		const unreadMsg: {
			[key: string]: number
		} = {}
		Object.keys(noticeData).forEach(key => {
			const value = noticeData[key]
			if (!unreadMsg[key]) {
				unreadMsg[key] = 0
			}
			if (Array.isArray(value)) {
				unreadMsg[key] = value.filter(item => !item.read).length
			}
		})
		return unreadMsg
	}

	render(): JSX.Element {
		const { currentUser, fetchingNotices, onNoticeVisibleChange } = this.props
		const noticeData = this.getNoticeData()
		const unreadMsg = this.getUnreadData(noticeData)

		return (
			<NoticeIcon
				className={styles.action}
				count={currentUser && currentUser.unreadCount}
				onItemClick={(item): void => {
					this.changeReadState(item as NoticeItem)
				}}
				loading={fetchingNotices}
				clearText={formatMessage({
					id: 'Clear',
				})}
				viewMoreText={formatMessage({
					id: 'View More',
				})}
				onClear={this.handleNoticeClear}
				onPopupVisibleChange={onNoticeVisibleChange}
				onViewMore={(): MessageType => message.info('Click on view more')}
				clearClose
			>
				<NoticeIcon.Tab
					tabKey="notification"
					count={unreadMsg.notification}
					list={noticeData.notification}
					title={formatMessage({
						id: 'Notifications',
					})}
					emptyText={formatMessage({
						id: 'Empty',
					})}
					showViewMore
				/>
				<NoticeIcon.Tab
					tabKey="message"
					count={unreadMsg.message}
					list={noticeData.message}
					title={formatMessage({
						id: 'Messages',
					})}
					emptyText={formatMessage({
						id: 'Empty',
					})}
					showViewMore
				/>
				<NoticeIcon.Tab
					tabKey="event"
					title={formatMessage({
						id: 'Events',
					})}
					emptyText={formatMessage({
						id: 'Empty',
					})}
					count={unreadMsg.event}
					list={noticeData.event}
					showViewMore
				/>
			</NoticeIcon>
		)
	}
}

export default GlobalHeaderRight
