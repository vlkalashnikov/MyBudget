import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Alert } from 'react-native'
import { Container, Icon, Fab, Spinner, Tabs, Tab } from 'native-base'

import { CategoriesActions } from '../../actions/CategoriesActions'
import { ToastTr } from '../../components/Toast'
import ListCategoriesIncome from '../../components/ListCategoriesIncome'
import ListCategoriesExpense from '../../components/ListCategoriesExpense'
import { styles as mainStyle } from '../../Style'


class Category extends Component {
  constructor(props) {
    super(props)

    this.state = {
      CategoryType: false,
      choosenCat: -1, 
      visibleModal: true,
    }

    this._addCategory = this._addCategory.bind(this)
    this._refreshData = this._refreshData.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.categories.Error.length > 0) {
      ToastTr.Danger(nextProps.categories.Error)
    }
  }

  _defineCatType(i) {
    let cur = (i == 0) ? false : true
    this.setState({ CategoryType: cur})
  }

  _addCategory() {
    this.props.navigation.navigate('AddEditCategory', {type:'add', CatType: this.state.CategoryType})
  }

  _deleteCategory = (item) => {
    Alert.alert(
      'Удаление',
      `Удалить категорию "${item.Name}"?`,
      [
        {text: 'Нет'},
        {text: 'Да', onPress: ()=> {
          this.props.deletecategory(item.Id)
        }
        },
      ]
    )
  }

  _refreshData() {
    this.props.getcategories(this.props.user.UserId)
  }

  _showModal = () => {
    this.setState({ visibleModal: true })
  }

  _hideModal = () => {
    this.setState({ visibleModal: false })
  }


  render() {
    const { navigation, categories } = this.props

    var income = []
    var expense = []

    categories.Categories.map(item => {
      if (item.CreatedBy) {
        if (item.CreatedBy.indexOf('SYS') < 0) { 
          if(item.IsSpendingCategory) {
            expense.push(item)
          } else {
            income.push(item)
          }
        }
      } else {
        if(item.IsSpendingCategory) {
          expense.push(item)
        } else {
          income.push(item)
        }
      }
    })

    return (
        <Container>

          {(categories.isLoad)
          ? <Spinner />
          :
            <Tabs initialPage={0} onChangeTab={({ i }) => this._defineCatType(i)}>
              <Tab heading="Приход">
                <ListCategoriesIncome categories={income} dropcategory={this._deleteCategory} navigation={navigation} refreshdata={this._refreshData} />
              </Tab>
              <Tab heading="Расход">
                <ListCategoriesExpense categories={expense} dropcategory={this._deleteCategory} navigation={navigation} refreshdata={this._refreshData} />
              </Tab>
            </Tabs>          
          }
          <Fab style={{ backgroundColor: '#34A34F' }} position="bottomRight" onPress={this._addCategory} >
            <Icon ios="ios-add" android="md-add" />
          </Fab>

        </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    categories: state.Categories,
    user: state.User
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deletecategory:(id) => {
      dispatch(CategoriesActions.Delete(id))
    },
    getcategories: (UserId) => {
      dispatch(CategoriesActions.Get(UserId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Category)