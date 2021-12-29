import {jest, expect, test} from '@jest/globals';
import {
    generateToken,
    voteIsInvalid,
    getVoteAverage,
    hideNotAllowedInformationToUsers,
    emitUpdates
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