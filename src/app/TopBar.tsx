import { BUTTON_SIZE, Button, COLOR, DropdownLinks, Row, useDialog } from "@/baseComponents"
import { AUTH_STATE, useAuth } from "@/hooks/useAuth"
import { useCart } from "@/hooks/useCart"
import { useRouter } from "next/navigation"

import CartIcon from '@mui/icons-material/ShoppingCart'
import AccountIcon from '@mui/icons-material/AccountCircle'
import HomeIcon from '@mui/icons-material/Home'
import StoreIcon from '@mui/icons-material/Store'
import { Z_INDEX } from "@/baseComponents/theme/custom"
import { useEffect, useState } from "react"

const TopControls = () => {
  const {isOpen, setIsOpen} = useCart()
  const {authState, handleSignOut} = useAuth()
  const router = useRouter()

  const { open } = useDialog('auth-modal')
  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => {
    setIsFirstRender(false)
  })

  if (isFirstRender && process.env.NODE_ENV === 'development') {
    return null
  }

  return (
    <Row>
      {authState === AUTH_STATE.SIGNED_OUT && (
        <Button
          color={COLOR.PRIMARY}
          textColor={COLOR.WHITE}
          primaryIcon={AccountIcon}
          size={BUTTON_SIZE.LG}
          sx={{
            mr: 2,
          }}
          onClick={() => {
            open()
          }}
        />
      )}

      {authState === AUTH_STATE.SIGNED_IN && (
        <>
          <Button
            color={COLOR.PRIMARY}
            textColor={COLOR.WHITE}
            primaryIcon={StoreIcon}
            size={BUTTON_SIZE.LG}
            sx={{
              mr: 2,
            }}
            onClick={() => {
              router.push('/')
            }}
          />
          <Button
            color={COLOR.PRIMARY}
            textColor={COLOR.WHITE}
            primaryIcon={HomeIcon}
            size={BUTTON_SIZE.LG}
            sx={{
              mr: 2,
            }}
            onClick={() => {
              router.push('/home')
            }}
          />
          <DropdownLinks
            options={[{
              label: 'Sign Out',
              onClick: () => {
                handleSignOut()
              },
              value: 'sign-out'
            }]}
          >
            {( { anchorProps }) => (
              <Button  
                {...anchorProps}
                color={COLOR.PRIMARY}
                textColor={COLOR.WHITE}
                primaryIcon={AccountIcon}
                size={BUTTON_SIZE.LG}
                sx={{
                  mr: 2,
                }}
              />
            )}
          </DropdownLinks>
        </>
      )}

      <Button
        color={COLOR.PRIMARY}
        textColor={COLOR.WHITE}
        primaryIcon={CartIcon}
        size={BUTTON_SIZE.LG}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        sx={{
          mr: 4,
        }}
      />
    </Row>
  )
}

export const TopBar = () => {
  return (
    <Row
      justify='center'
      sx={{
        width: '100%',
        height: '64px',
        bg: COLOR.PRIMARY,
        zIndex: Z_INDEX.ELEVATED + 1
      }}
    >
      <Row sx={{maxWidth: '1000px', width: '100%'}} justify="space-between" align="center">
        <Row>
          <img
            src="https://raw.githubusercontent.com/Gavin-Ramos/defiber/refs/heads/main/src/app/favicon.ico"
            onClick={() => {
              window.location.href = '/'
            }}
            style={{
              height: '40px',
              width: 'auto',
              cursor: 'pointer'
            }}
          />
        </Row>
        <Row>
          <TopControls />
        </Row>
      </Row>
    </Row>
  )
}
