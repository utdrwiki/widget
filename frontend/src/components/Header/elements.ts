import Button from '../../modules/styled-elements/button'
import styled from '../../controllers/emotion'

const Hash = styled.div`
  background-position: 50%;
  background-repeat: no-repeat;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3e%3cpath fill='${({ theme }) => encodeURIComponent(theme._primary.fadeOut(0.6).toString())}' d='M3.6 14l.5-2.7H1.4l.2-1.3h2.7L5 6H2.4l.2-1.3h2.7L5.7 2h1.4l-.5 2.7h4L11 2h1.3l-.5 2.7h2.7L14.4 6h-2.7l-.7 4h2.6l-.2 1.3h-2.7l-.4 2.7H8.9l.5-2.7h-4L5 14H3.6zm2.8-8l-.8 4h4l.8-4h-4z'/%3e%3c/svg%3e");
`

export const Root = styled.header`
  overflow: hidden;
  display: flex;
  flex-shrink: 0;
  z-index: 8;
  height: 47px;
  line-height: 25px;
  padding: 10px 0;
  background-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.1),
    0px 4px 5px 0px rgba(0, 0, 0, 0.12), 0px 1px 10px 0px rgba(0, 0, 0, 0.09),
    0 1px 0 rgba(0, 0, 0, 0.1), 0 2px 0 rgba(0, 0, 0, 0.06);

  @media (max-width: 270px), (max-height: 300px) {
    height: 41px;
    padding: 7px 0;
  }
`

export const Stretch = styled.div`
  display: flex;
  flex-grow: 1;
  overflow: hidden;
`

export const Name = styled(Hash)`
  font-size: 18px;
  font-weight: 600;
  height: 25px;
  margin: 0 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;

  background-position: 0 50%;
  padding-left: 25px;

  @media (max-width: 350px) {
    background: none;
    padding-left: 0;
  }

  @media (max-width: 330px) {
    flex-shrink: 1;
  }

  @media (max-width: 270px) {
    font-size: 16px;
  }
`

export const Topic = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  padding: 0 15px;
  border-left: 1px solid
    ${({ theme }) => theme._primary.fadeOut(0.9).toString()};
  color: ${({ theme }) => theme._primary.fadeOut(0.4).toString()};

  @media (max-width: 330px) {
    display: none;
  }
`

const JoinLink = Button.withComponent('a')

export const Join = styled(JoinLink)`
  background: ${({ theme }) => theme.accent};
  margin-right: 20px;
`
