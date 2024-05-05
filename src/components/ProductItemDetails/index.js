import {Component} from 'react'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import SimilarProductItem from '../SimilarProductItem'

import Header from '../Header'

import './index.css'

const apiConstants = {
  apiConstantsSuccess: 'SUCCESS',
  apiConstantsFailure: 'FAILURE',
  apiConstantsProgress: 'PROGRESS',
  apiConstantsInitial: 'INITIAL',
}

class ProductItemDetails extends Component {
  state = {
    productDetailData: {},
    similarProductsData: [],
    activeApiConstants: apiConstants.initial,
    productQuantity: 1,
  }

  componentDidMount() {
    this.getProductsData()
  }

  formatProductDetailsData = eachData => ({
    availability: eachData.availability,
    brand: eachData.brand,
    description: eachData.description,
    id: eachData.id,
    imageUrl: eachData.image_url,
    price: eachData.price,
    rating: eachData.rating,
    style: eachData.style,
    title: eachData.title,
    totalReviews: eachData.total_reviews,
    similarProducts: eachData.similar_products,
  })

  formatSimilarProductData = eachData => ({
    id: eachData.id,
    imageUrl: eachData.image_url,
    title: eachData.title,
    brand: eachData.brand,
    price: eachData.price,
    rating: eachData.rating,
  })

  getProductsData = async () => {
    this.setState({
      activeApiConstants: apiConstants.apiConstantsProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params

    console.log(id)

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()

      const updatedProductDetailsData = this.formatProductDetailsData(data)
      console.log(updatedProductDetailsData)
      const updatedSimilarProductDetails =
        updatedProductDetailsData.similarProducts.map(eachData =>
          this.formatSimilarProductData(eachData),
        )
      console.log(updatedSimilarProductDetails)

      this.setState({
        productDetailData: updatedProductDetailsData,
        similarProductsData: updatedSimilarProductDetails,
        activeApiConstants: apiConstants.apiConstantsSuccess,
      })
    } else {
      this.setState({
        activeApiConstants: apiConstants.apiConstantsFailure,
      })
    }
  }

  onDecreaseQuantity = () => {
    const {productQuantity} = this.state

    if (productQuantity > 1) {
      this.setState(prevState => ({
        productQuantity: prevState.productQuantity - 1,
      }))
    }
  }

  onIncreaseQuantity = () => {
    this.setState(prevState => ({
      productQuantity: prevState.productQuantity + 1,
    }))
  }

  onClickContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderLoaderView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductDetailsView = () => {
    const {productDetailData, similarProductsData, productQuantity} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productDetailData
    return (
      <div className="product-detail-container">
        <div className="product-img-data-container">
          <img src={imageUrl} className="product-img" alt="product" />
          <div className="product-data">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="rating-review-container">
              <div className="rating-container">
                <p className="product-rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  className="star-img"
                  alt="star"
                />
              </div>
              <p className="product-review">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>

            <div className="available-container">
              <p className="available-header">Available:</p>
              <p className="available-value">{availability}</p>
            </div>

            <div className="available-container">
              <p className="available-header">Brand:</p>
              <p className="available-value">{brand}</p>
            </div>

            <hr className="line-break" />

            <div className="quantity-btn-container">
              <button
                className="quantity-btn"
                onClick={this.onDecreaseQuantity}
                type="button"
                data-testid="minus"
              >
                <BsDashSquare className="quantity-button-icon" />
              </button>

              <p className="product-quantity">{productQuantity}</p>

              <button
                className="quantity-btn"
                onClick={this.onIncreaseQuantity}
                type="button"
                data-testid="plus"
              >
                <BsPlusSquare className="quantity-button-icon" />
              </button>
            </div>

            <button className="add-to-cart-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>

        <h1 className="similar-product-heading">Similar Products</h1>
        <ul className="similar-product-lists">
          {similarProductsData.map(eachData => (
            <SimilarProductItem
              key={eachData.id}
              similarProductsDetails={eachData}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderErrorView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-view-img"
      />
      <h1 className="product-notfound">Product Not Found</h1>
      <button
        className="continue-shopping-btn"
        onClick={this.onClickContinueShopping}
      >
        Continue Shopping
      </button>
    </>
  )

  renderOutputView = () => {
    const {activeApiConstants} = this.state

    switch (activeApiConstants) {
      case apiConstants.apiConstantsProgress:
        return this.renderLoaderView()
      case apiConstants.apiConstantsSuccess:
        return this.renderProductDetailsView()
      case apiConstants.apiConstantsFailure:
        return this.renderErrorView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderOutputView()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
