import React from 'react'
import {Dropdown, Menu} from 'semantic-ui-react'

const Categories = () => (
    <Menu vertical>
        <Dropdown item text="카테고리">
            <Dropdown.Menu>
                <Dropdown.Item>전체보기</Dropdown.Item>
                <Dropdown.Item>장르1</Dropdown.Item>
                <Dropdown.Item>장르2</Dropdown.Item>
                <Dropdown.Item>장르3</Dropdown.Item>
                <Dropdown.Item>...</Dropdown.Item>
                {/*각 장르 클릭시 영화 리스트 정렬하는 기능 추가 필요*/}
            </Dropdown.Menu>
        </Dropdown>
    </Menu>
)

export default Categories;