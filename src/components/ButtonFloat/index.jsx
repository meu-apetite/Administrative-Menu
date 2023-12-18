import React from 'react'
import * as S from './style'

const ButtonFloat = (props) => {
  return (
  <S.ButtonCustom variant="contained" onClick={props.onClick}>
    {props.text}
  </S.ButtonCustom>
  )
}

export default ButtonFloat
