import { jest, expect, test } from '@jest/globals'
import {
    voteIsInvalid,
    getVoteAverage,
    hideNotAllowedInformationToUsers
} from './issue.helpers.controller.js'

test('vote is valid', () => {
    let isInvalid = voteIsInvalid(1)
    expect(isInvalid).toBe(false)
    isInvalid = voteIsInvalid(13)
    expect(isInvalid).toBe(false)
    isInvalid = voteIsInvalid('?')
    expect(isInvalid).toBe(false)
})

test('vote is invalid', () => {
    let isInvalid = voteIsInvalid(10)
    expect(isInvalid).toBe(true)
    isInvalid = voteIsInvalid(100)
    expect(isInvalid).toBe(true)
})

test('get vote average', () => {
    const mockIssue = {
        status: 'reveal',
        members: [
            {
                id: 1,
                name: 'Moderator',
                role: 'moderator',
                status: 'joined'
            },
            {
                id: 2,
                name: 'User1',
                status: 'joined',
                value: 20
            },
            {
                id: 3,
                name: 'User2',
                status: 'joined',
                value: 5
            },
            {
                id: 4,
                name: 'User3',
                status: 'joined',
                value: 8
            }
        ]
    }
    expect(getVoteAverage(mockIssue)).toBe(11)
})

test('hide sensitive information', () => {
    const mockIssue = {
        status: 'voting',
        members: [
            {
                id: 1,
                name: 'Moderator',
                role: 'moderator',
                status: 'joined'
            },
            {
                id: 2,
                name: 'User1',
                status: 'joined',
                value: 20
            },
            {
                id: 3,
                name: 'User2',
                status: 'joined',
                value: 5
            },
            {
                id: 4,
                name: 'User3',
                status: 'joined',
                value: 8
            }
        ]
    }
    const expectedResult = {
        status: 'voting',
        members: [
            {
                id: 1,
                name: 'Moderator',
                role: 'moderator',
                status: 'joined'
            },
            {
                id: 2,
                name: 'User1',
                status: 'joined'
            },
            {
                id: 3,
                name: 'User2',
                status: 'joined'
            },
            {
                id: 4,
                name: 'User3',
                status: 'joined'
            }
        ]
    }
    expect(hideNotAllowedInformationToUsers(mockIssue)).toMatchObject(
        expectedResult
    )
})
