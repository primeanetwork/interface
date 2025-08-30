import { SVGProps, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, styled, useSporeColors } from 'ui/src'

function Logo({ color, onClick }: { color: string; onClick?: () => void }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="22"
      viewBox="0 0 170.06 176.95"
      fill="none"
      onClick={onClick}
      cursor="pointer"
      role="img"
      aria-label="Primea"
    >
      <path
        d="M169,75.17l1-1L144.7,25.19,97.21.64,95.87,0l-1,1h0L72.23,23.62,50.61,12.45l-1.29-.7L48.23,12.8h0l-.44.43-.59.57v0L0,61l.64,1.3h0l23.77,48.24,11.88,5.88L54,152.32l48.46,24h0l1.3.64L152,128.73h0l1.05-1-12.46-24L169,75.17Zm-27.31-47,21.26,41L121.25,48.55,100.79,7ZM96.24,70.71,74.62,60.33,63.6,38,95.73,5.83,117.3,49.65ZM60.48,77.34,71,98.76l22.5,11.14L73.21,130.22,29.33,108.49Zm42.6,28.72,44,21.8-44.2,44.19-44-21.8Zm-6.54.83L76,96.7,90.07,82.58l10.16,20.62Zm-23.44-13L63.49,74.33l10-10,19.69,9.44ZM69.24,26.62l-7.53,7.52L54.17,18.83ZM4.89,61.83l44.2-44.19L70.67,61.45,26.48,105.64Zm37.35,57.55,28,13.85L56,147.4Zm61.94-17.27L93.08,79.57l9.33-9.33,22.23,11.49,21.27,41Zm23.45-23.37L105.4,67.25,120.15,52.5l44,21.81L138.6,99.89Z"
        fill={color}
      />
    </svg>
  )
}


function HolidayLogo({ color, onClick }: { color: string; onClick?: () => void }) {
  const { t } = useTranslation()
  const size = 32

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="22"
      viewBox="0 0 170.06 176.95"
      fill="none"
      onClick={onClick}
      cursor="pointer"
      role="img"
      aria-label="Primea"
    >
      <path
        d="M169,75.17l1-1L144.7,25.19,97.21.64,95.87,0l-1,1h0L72.23,23.62,50.61,12.45l-1.29-.7L48.23,12.8h0l-.44.43-.59.57v0L0,61l.64,1.3h0l23.77,48.24,11.88,5.88L54,152.32l48.46,24h0l1.3.64L152,128.73h0l1.05-1-12.46-24L169,75.17Zm-27.31-47,21.26,41L121.25,48.55,100.79,7ZM96.24,70.71,74.62,60.33,63.6,38,95.73,5.83,117.3,49.65ZM60.48,77.34,71,98.76l22.5,11.14L73.21,130.22,29.33,108.49Zm42.6,28.72,44,21.8-44.2,44.19-44-21.8Zm-6.54.83L76,96.7,90.07,82.58l10.16,20.62Zm-23.44-13L63.49,74.33l10-10,19.69,9.44ZM69.24,26.62l-7.53,7.52L54.17,18.83ZM4.89,61.83l44.2-44.19L70.67,61.45,26.48,105.64Zm37.35,57.55,28,13.85L56,147.4Zm61.94-17.27L93.08,79.57l9.33-9.33,22.23,11.49,21.27,41Zm23.45-23.37L105.4,67.25,120.15,52.5l44,21.81L138.6,99.89Z"
        fill={color}
      />
    </svg>
  )
}

const Container = styled(Flex, {
  position: 'relative',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'auto',
  variants: {
    clickable: {
      true: { cursor: 'pointer' },
    },
  },
})

type NavIconProps = SVGProps<SVGSVGElement> & {
  clickable?: boolean
  onClick?: () => void
}

export const NavIcon = ({ clickable, onClick }: NavIconProps) => {
  const colors = useSporeColors()
  const showHolidayUni = useMemo(() => {
    const date = new Date()
    // months in javascript are 0 indexed...
    const month = date.getMonth() + 1
    const day = date.getDate()
    return month === 12 || (month === 1 && day <= 7)
  }, [])

  return (
    <Container clickable={clickable}>
      {showHolidayUni ? (
        <HolidayLogo color={colors.accent1.val} onClick={onClick} />
      ) : (
        <Logo color={colors.accent1.val} onClick={onClick} />
      )}
    </Container>
  )
}
