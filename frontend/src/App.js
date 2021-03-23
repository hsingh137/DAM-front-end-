import React, { Component , useState } from 'react';
import './App.css';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.css';

import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import CardDeck from 'react-bootstrap/CardDeck';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

class MasterForm extends React.Component {

  componentDidMount() {
    this.props.hideLoader();
  }
  
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      currentStep: 1,
      formData:{
      name:  '',
      calories: '14000',
      protein: '280', 
      fats: '180', 
      carbs: '400',
      allergens : [],
      tags : []
      },
      result: {cost : ''  , recipes : [ ] ,
    ingreds : [ ]

       }};

  }




  // handle the lsit input 

  handlelist = (e) => {
    var emp_list ;
   emp_list = []
   let currentStep = this.state.currentStep;
    var a;
    for(a in e) {
      emp_list.push(e[a]['value']);
    }
    if (currentStep  == 4){
      this.state.formData.allergens  = emp_list
    }else if(currentStep  == 5){
      this.state.formData.tags  = emp_list
    }
    
  }

  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    let target = event.target;
    var formData = this.state.formData;
    formData[name] = value;
    this.setState({
      formData
    });
  }

handleResponse = (r) =>{
  
  var res;
  res = r.result[0]
// turn recipes into list of lists 
  var result = this.state.result;
  result['cost'] = res['Total cost'] ; 
  result['recipes'] = res['recipes'] ; 
  result['ingreds'] = res['ingreds'] ; 
  this.setState({
      result,
    isLoading: false
  });
  console.log(this.state.result['recipes'])

  
}



//show resutls


showResults() {
  let list1 = this.state.result.recipes.slice(0,3);
  console.log(list1)
  let list2 = this.state.result.recipes.slice(3,6);
  let list3 = this.state.result.recipes.slice(6,9);
  return (
    <div className = "content">
    <center> <h3>Total Cost: {this.state.result.cost}</h3> </center>  

    <center> <h3>View Recipes Here</h3> </center>  
    <Row>
    <br></br>
    <CardDeck>
        {list1.map((value, index) => {
          return( 
            <Card bg="lecondary"  key={index}  text='dark'>
              <Card.Header>Recipe {index + 1}</Card.Header>
            <Card.Body>
              
              <Card.Text>
              <Card.Title>{value['Name']}</Card.Title>
    
                <ListGroup variant="flush">
                  <ListGroup.Item> Calories: {value['calories']} </ListGroup.Item>
                  <ListGroup.Item> Protein: {value['Protein']} </ListGroup.Item>
                  <ListGroup.Item> Fats: {value['fat']} </ListGroup.Item>
                  <ListGroup.Item> Carbohydrates: {value['Carbohydrate']} </ListGroup.Item>
                </ListGroup>

              </Card.Text>
            </Card.Body>
          </Card>
          )
        })}
  </CardDeck>
</Row>
<br></br>
<Row>
<CardDeck>
        {list2.map((value, index) => {
          return( 
            <Card bg="ligasht"  key={index}  text='Dark'>
            <Card.Header>Recipe {index+4}</Card.Header>
          <Card.Body>
            
            <Card.Text>
            <Card.Title>{value['Name']}</Card.Title>
            <ListGroup variant="flush">

                <ListGroup.Item> Calories: {value['calories']} </ListGroup.Item>
                <ListGroup.Item> Protein: {value['Protein']} </ListGroup.Item>
                <ListGroup.Item> Fats: {value['fat']} </ListGroup.Item>
                <ListGroup.Item> Carbohydrates: {value['Carbohydrate']} </ListGroup.Item>
                </ListGroup>
            </Card.Text>
          </Card.Body>
        </Card>
          )
        })}
  </CardDeck>
    </Row>

    <br></br>
<Row>
<CardDeck>
        {list3.map((value, index) => {
          return( 
            <Card bg="ligsaht"  key={index}  text='Dark'>
            <Card.Header>Recipe {index+7}</Card.Header>
          <Card.Body>
            
            <Card.Text>
            <Card.Title>{value['Name']}</Card.Title>
  
              <ListGroup variant="flush">
                <ListGroup.Item> Calories: {value['calories']} </ListGroup.Item>
                <ListGroup.Item> Protein: {value['Protein']} </ListGroup.Item>
                <ListGroup.Item> Fats: {value['fat']} </ListGroup.Item>
                <ListGroup.Item> Carbohydrates: {value['Carbohydrate']} </ListGroup.Item>
              </ListGroup>

            </Card.Text>
          </Card.Body>
        </Card>
          )
        })}
  </CardDeck>
    </Row>
   <br></br>
   <center> <h3>Your Grocery List </h3> </center>  
<Row> 

<Table striped bordered hover size="sm">
  <thead>
    <tr>
      <th>#</th>
      <th>Ingredient</th>
      <th>Quantity</th>
    </tr>
  </thead>
  <tbody>
        {this.state.result.ingreds.map((value,index)  => {
          return(
            <tr>
            <td>{index}</td>
            <td>{value['Name']}</td>
            <td>{value['Quantity']}</td>
          </tr>

          )
        })}

  </tbody>

  </Table>
</Row>

  </div>
    )
}



handlePredictClick = () => {
    const formData = this.state.formData;
    console.log(formData);
    this.setState({isLoading: true });
    fetch('http://127.0.0.1:5000/prediction/', 
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(response => this.handleResponse(response));
      
  }

  // Trigger an alert on form submission
  handleSubmit = (event) => {
    event.preventDefault()
    let currentStep = this.state.currentStep
    console.log('pressed enttered')
    if (currentStep  == 5){
      this.handlePredictClick()
    }else{
      this._next()
    }
    
  }

  //do this when enter is pressed 
_handleKeyDown = (e) => {
  let currentStep = this.state.currentStep
  if (e.key === 'Enter') {
    if (currentStep  == 5){
      this.handlePredictClick()
    }else{
      this._next()
    }
    
  }
}


  _next = () => {
    let currentStep = this.state.currentStep
    currentStep = currentStep >= 4? 5: currentStep + 1
    this.setState({
      currentStep: currentStep
    });

  }
    
  _prev = () => {
    let currentStep = this.state.currentStep
    currentStep = currentStep <= 1? 1: currentStep - 1
    this.setState({
      currentStep: currentStep
    })
  }

/*
* the functions for our button
*/
previousButton() {
  let currentStep = this.state.currentStep;
  if(currentStep !==1){
    return (
      <Button variant="secondary float-left"
       onClick={this._prev} >
      Previous
      </Button>
    )
  } 
  return null;
}

nextButton(){
  let currentStep = this.state.currentStep;
  if(currentStep < 5){
    return (

      <Button variant="primary float-right"
       onClick={this._next} >
      Next
      </Button>  

    )
  }else if(currentStep = 5){
   return (
    <Button variant="primary float-right"
      onClick={!this.state.isLoading ?  this.handlePredictClick: null } 
       disabled={this.state.isLoading} >
   {this.state.isLoading ? 'Loading…' : 'Submit '}
   </Button> 

   )
   };
 
}



render() {
  
  return (
      <React.Fragment>

      <Container>
        <div>
          <h1 className ='title'>SMART FOOD</h1>
        </div>
      <div className = "content">
      <Form onSubmit={this.handleSubmit}   onKeyDown={this._handleKeyDown}>

      {/* 
        render the form steps and pass required props in
      */}
        <Step1 
          currentStep={this.state.currentStep} 
          handleChange={this.handleChange}
          email={this.state.formData.email}
        />
        <Step2 
          formData = {this.state.formData}
          currentStep={this.state.currentStep} 
          handleChange={this.handleChange}
          
        />
        <Step3 
          currentStep={this.state.currentStep} 
          handleChange={this.handleChange}
          calories={this.state.formData.calories}
          protein={this.state.formData.protein}
          fats={this.state.formData.fats}
          carbs={this.state.formData.carbs}
        />

        <Step4 
          currentStep={this.state.currentStep} 
          handleChange={this.handlelist}
          allergens={this.state.formData.allergens}
        />    


         <Step5
          currentStep={this.state.currentStep} 
          handleChange={this.handlelist}
          allergens={this.state.formData.tags}
        />    
    
         {this.nextButton()}
        {this.previousButton()}
      </Form>


  

      
      </div>
    
  
      {/* display result */}
   {this.state.result['recipes'].length == 0 ? null : this.showResults() }


      </Container>

      </React.Fragment>
    );
  }
}

function Step1(props) {
  if (props.currentStep !== 1) {
    return null
  } 
  
  return(
   
    <div className="form-group">
        <label htmlFor="email">Name</label>
        {/* <input
          className="form-control"
          id="email"
          name="email"
          type="text"
          placeholder="Enter Name"
          value={props.name}
          onChange={props.handleChange}
          
          /> */}
            <Form.Control 
                  type="text" 
                  placeholder="Enter Name" 
                  name="email"
                  value={props.email}
                  defaultValue = ''
                  onChange={props.handleChange} />
   </div>
    
  );
}


function Step2(args) {
  const formData = args.formData;
  if (args.currentStep !== 2) {
    return null
  }
  
  return(
    <div className="form-group">
   <center> <h3> Hi {args.formData.email} ,<br></br> let's optimize your fridge! </h3></center>
    </div>
   
  );

}


function Step3(props) {
  if (props.currentStep !== 3) {
    return null
  } 
  return(
    <React.Fragment>
    {/* <div className="form-group">
      <label htmlFor="password">Password</label>
      <input
        className="form-control"
        id="password"
        name="password"
        type="password"
        placeholder="Enter password"
        value={props.password}
        onChange={props.handleChange}
        />      
    </div> */}

    <Form>
      <Form.Row>

          <Form.Group as={Col}  controlId="formGridAddress1">
            <Form.Label>Calories</Form.Label>
            <Form.Control 
                          type="float" 
                          placeholder="Enter Calories" 
                          name="calories"
                          value={props.calories}
                          defaultValue = '1'
                          onChange={props.handleChange} />
          </Form.Group>

          <Form.Group as={Col}  controlId="formGridAddress2">
              <Form.Label>Protein</Form.Label>
              <Form.Control 
                            type="float" 
                            placeholder="Enter Protein" 
                            name="protein"
                            value={props.protein}
                            defaultValue = '1'
                            onChange={props.handleChange} />
          </Form.Group>
      </Form.Row>

      <Form.Row>
          <Form.Group as={Col}  controlId="formGridAddress4">
              <Form.Label>Fats</Form.Label>
              <Form.Control 
                            type="float" 
                            placeholder="Enter Fats" 
                            name="fats"
                            value={props.fats}
                            defaultValue = '1'
                            onChange={props.handleChange} />
          </Form.Group>

          <Form.Group as={Col}  controlId="formGridAddress4">
              <Form.Label>Carbs</Form.Label>
              <Form.Control 
                            type="float" 
                            placeholder="Enter Carbs" 
                            name="carbs"
                            value={props.carbs}
                            defaultValue = '1'
                            onChange={props.handleChange} />
          </Form.Group>

      </Form.Row>

    </Form>
      
    </React.Fragment>
  );
};



function Step4(args) {
  const formData = args.formData;
  if (args.currentStep !== 4) {
    return null
  }

  const options = [
    { value: 'Celery', label: 'Celery' },
    { value: 'Crustaceans', label: 'Crustaceans' },
    { value: 'Egg', label: 'Egg' },
    { value: 'Fish', label: 'Fish' },
    { value: 'Gluten', label: 'Gluten' },
    { value: 'Milk', label: 'Milk' },
    { value: 'Mustard', label: 'Mustard' },
    { value: 'Nuts', label: 'Nuts' },
    { value: 'Peanuts', label: 'Peanuts' },
    { value: 'Sesame', label: 'Sesame' },
    { value: 'Soya', label: 'Soya' },
    { value: 'Sulphites', label: 'Sulphites' }
  ]
  
  const animatedComponents = makeAnimated();

  return(

    <div>
      <label htmlFor="allerges">Enter any allegers that you may have!</label>
        <Select
        closeMenuOnSelect={false}
        components={animatedComponents}
        defaultValue={[options[4]]}
        isMulti
        options={options}
        name = "allergens"
        onChange = {args.handleChange}
        values = {args.allergens}
      />

<br/>

</div>
);
}




function Step5(args) {
  const formData = args.formData;
  if (args.currentStep !== 5) {
    return null
  }

  const options = [
    { value: 'Spicy', label: 'Spicy' },
    { value: 'Vegan', label: 'Vegan' },
    { value: 'Quick', label: 'Quick' },
    { value: 'Veggie', label: 'Veggie' },
    { value: 'Low Salt', label: 'Low Salt' },
    { value: 'Summer', label: 'Summer' },
    { value: 'Quick', label: 'Quick' },
    { value: 'Plant-based', label: 'Plant-based' },
  
  ]
  

  // {'Low Sat Fat', 'High Fiber', 'Equipment Needed', 'Quick', 'Rapid', 'Under 750 calories', 'Chicken', 'Dairy Free', 'Lactose Free', 'Vegan', 'Family Friendly', 'Extra spicy', 'Calorie Smart', 'Balanced', 
  // 'Family Box', 'Healthy', 'Pork', 'Veggie', 'Beef', 'Not Suitable for Coeliacs', 'Exploration', 'One Pot Wonder', 'Low Fat', 'Fish', 
  // 'Under 550 calories', "Chef's Choice", 'Low Salt', 'No Gluten Containing Ingredients', '
  // Summer', 'Naturally Gluten-Free', 'Under 600 calories', 'Spicy', 'Plant-based', 'Eat First', 'Salad'}

  const animatedComponents = makeAnimated();
  return(

    <div>
        <label htmlFor="allerges">Any thing else you want in your recipes!</label>
        <Select
        closeMenuOnSelect={false}
        components={animatedComponents}
        defaultValue={[options[0]]}
        isMulti
        options={options}
        name = "allergens"
        onChange = {args.handleChange}
        values = {args.tags}
      />

<br/>

</div>
);
}



export default MasterForm;

//ReactDOM.render(<MasterForm />, document.getElementById('root'))
