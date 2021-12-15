import { Container, Button, Form, Dropdown, InputGroup, FormControl } from "react-bootstrap"
import BackendAPI from '../api/BackendAPI'
import { useState, useContext } from 'react'

import UserContext from '../contexts/UserContext'


let NewPosForm = (props) => {
    const { user } = useContext(UserContext)
    const [asset, setAsset] = useState(null)
    const [searchFilter, setSearchFilter] = useState('')
    const [hideForm, setHideForm] = useState(false)


    const handleNewPosSubmit = async (event) => {
        props.setTriggerUpdate(false)
        event.preventDefault()
        const posData = {
          user: user.id,
          asset_id: asset,
          quantity: event.target.elements[2].value,
          date_purchased: event.target.elements[4].value,
          price_purchased: event.target.elements[3].value,
          closed: false
        }
        await BackendAPI.addNewPosition(localStorage.getItem("auth-user"), posData)
        setHideForm(true)
        props.setTriggerUpdate(true)
      }

    const handleSelectAsset = (event) => {
          event.preventDefault()
          let asset_id = event.target.id
          setAsset(asset_id)
          setSearchFilter('') 
      }


    const renderDropMenu = () => {
    return <Dropdown className="coin-list-dropdown" >
            <Dropdown.Toggle variant="dark">Select Asset</Dropdown.Toggle>
            <Dropdown.Menu variant="dark" className="add-pos-drop"> 
            <div className="search-bar">
            <InputGroup>
            <InputGroup.Text>Search</InputGroup.Text>
              <FormControl placeholder="Search" value={searchFilter} onChange={(evt) => {setSearchFilter(evt.target.value)}}/>
            </InputGroup>
            </div>
      { props.coinList.filter(coin => { 
        return searchFilter === "" || coin.id.toLowerCase().includes(searchFilter.toLowerCase())
        }).map((elem) => {
        return <Dropdown.Item id={elem.id} key={elem.id} onClick={handleSelectAsset}>{elem.id.toUpperCase()}</Dropdown.Item>
      })
            }
        </Dropdown.Menu>
        </Dropdown>
        }



    return ( 

        <Container  className="pos-form-div">
                {hideForm && 
                    <h2>Position Added!</h2>
                }

                { !hideForm && 
                <div >  
                    <Form className="new-pos-form" onSubmit={handleNewPosSubmit}>
                    { props.coinList &&
                        renderDropMenu()
                    }  
                    {  asset &&
                        <h5 className="form-asset-name">{asset.toUpperCase()}</h5>
                    }
                            <br />
                        <Form.Group>
                            <Form.Label>Amount</Form.Label>
                                <Form.Control placeholder="Amount" />
                        </Form.Group>
                            <br />
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                                <Form.Control placeholder="Price $usd" />
                        </Form.Group>
                            <br />
                        <Form.Group>
                            <Form.Label>Date Purchased</Form.Label>
                                <Form.Control type="date" placeholder="Date Purchased" />
                        </Form.Group>
                                <Button className="form-buttons" variant="success" type="submit">
                                    Add to Portfolio
                                </Button>  
            
                                </Form>  
                                
                            </div>
                            } 
        </Container>
    )


}

export default NewPosForm


