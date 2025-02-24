import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('type/compiler/Record', () => {
  it('Should validate when all property values are numbers', () => {
    const T = Type.Record(Type.String(), Type.Number())
    Ok(T, { a: 1, b: 2, c: 3 })
  })

  it('Should validate when all property keys are strings', () => {
    const T = Type.Record(Type.String(), Type.Number())
    Ok(T, { a: 1, b: 2, c: 3, '0': 4 })
  })

  it('Should validate when specifying string union literals when additionalProperties is true', () => {
    const K = Type.Union([Type.Literal('a'), Type.Literal('b'), Type.Literal('c')])
    const T = Type.Record(K, Type.Number())
    Ok(T, { a: 1, b: 2, c: 3, d: 'hello' })
  })

  it('Should not validate when specifying string union literals when additionalProperties is false', () => {
    const K = Type.Union([Type.Literal('a'), Type.Literal('b'), Type.Literal('c')])
    const T = Type.Record(K, Type.Number(), { additionalProperties: false })
    Fail(T, { a: 1, b: 2, c: 3, d: 'hello' })
  })

  it('Should validate for keyof records', () => {
    const T = Type.Object({
      a: Type.String(),
      b: Type.Number(),
      c: Type.String(),
    })
    const R = Type.Record(Type.KeyOf(T), Type.Number())
    Ok(R, { a: 1, b: 2, c: 3 })
  })

  it('Should not validate for unknown key via keyof', () => {
    const T = Type.Object({
      a: Type.String(),
      b: Type.Number(),
      c: Type.String(),
    })
    const R = Type.Record(Type.KeyOf(T), Type.Number(), { additionalProperties: false })
    Fail(R, { a: 1, b: 2, c: 3, d: 4 })
  })

  it('Should should validate when specifying regular expressions', () => {
    const K = Type.RegEx(/^op_.*$/)
    const T = Type.Record(K, Type.Number())
    Ok(T, {
      op_a: 1,
      op_b: 2,
      op_c: 3,
    })
  })

  it('Should should not validate when specifying regular expressions and passing invalid property', () => {
    const K = Type.RegEx(/^op_.*$/)
    const T = Type.Record(K, Type.Number())
    Fail(T, {
      op_a: 1,
      op_b: 2,
      aop_c: 3,
    })
  })

  // ------------------------------------------------------------
  // Integer Keys
  // ------------------------------------------------------------

  it('Should validate when all property keys are integers', () => {
    const T = Type.Record(Type.Integer(), Type.Number())
    Ok(T, { '0': 1, '1': 2, '2': 3, '3': 4 })
  })

  it('Should validate when all property keys are integers, but one property is a string with varying type', () => {
    const T = Type.Record(Type.Integer(), Type.Number())
    Fail(T, { '0': 1, '1': 2, '2': 3, '3': 4, a: 'hello' })
  })

  it('Should not validate if passing a leading zeros for integers keys', () => {
    const T = Type.Record(Type.Integer(), Type.Number())
    Fail(T, {
      '00': 1,
      '01': 2,
      '02': 3,
      '03': 4,
    })
  })

  it('Should not validate if passing a signed integers keys', () => {
    const T = Type.Record(Type.Integer(), Type.Number())
    Fail(T, {
      '-0': 1,
      '-1': 2,
      '-2': 3,
      '-3': 4,
    })
  })

  // ------------------------------------------------------------
  // Number Keys
  // ------------------------------------------------------------

  it('Should validate when all property keys are numbers', () => {
    const T = Type.Record(Type.Number(), Type.Number())
    Ok(T, { '0': 1, '1': 2, '2': 3, '3': 4 })
  })

  it('Should validate when all property keys are numbers, but one property is a string with varying type', () => {
    const T = Type.Record(Type.Number(), Type.Number())
    Fail(T, { '0': 1, '1': 2, '2': 3, '3': 4, a: 'hello' })
  })

  it('Should not validate if passing a leading zeros for numeric keys', () => {
    const T = Type.Record(Type.Number(), Type.Number())
    Fail(T, {
      '00': 1,
      '01': 2,
      '02': 3,
      '03': 4,
    })
  })

  it('Should not validate if passing a signed numeric keys', () => {
    const T = Type.Record(Type.Number(), Type.Number())
    Fail(T, {
      '-0': 1,
      '-1': 2,
      '-2': 3,
      '-3': 4,
    })
  })

  it('Should not validate when all property keys are numbers, but one property is a string with varying type', () => {
    const T = Type.Record(Type.Number(), Type.Number())
    Fail(T, { '0': 1, '1': 2, '2': 3, '3': 4, a: 'hello' })
  })
  it('Should fail record with Date', () => {
    const T = Type.Record(Type.String(), Type.String())
    Fail(T, new Date())
  })
  it('Should fail record with Uint8Array', () => {
    const T = Type.Record(Type.String(), Type.String())
    Fail(T, new Uint8Array())
  })
})
