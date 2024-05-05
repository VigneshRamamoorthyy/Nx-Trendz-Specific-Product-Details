import './index.css'

const SimilarProductItem = props => {
  const {similarProductsDetails} = props
  const {imageUrl, title, brand, price, rating} = similarProductsDetails
  return (
    <li className="similar-product-list">
      <img
        src={imageUrl}
        className="similar-product-img"
        alt={`similar product ${title}`}
      />
      <h1 className="similar-product-title">{title}</h1>
      <p className="similar-product-brand">{brand}</p>

      <div className="price-review-container">
        <p className="similar-product-price">Rs {price}</p>
        <div className="similar-product-rating-container">
          <p className="similar-product-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            className="similar-product-star-img "
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
