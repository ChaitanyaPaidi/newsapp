import React, {useEffect, useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';


const News=(props)=>{
  const [articles, setArticles]=useState([])
  const [loading, setLoading]=useState(true)
  const [page, setPage]=useState(1)
  const [totalResults, setTotalResults]=useState(0)
  // document.title=`${capitalizeFirstLetter(props.category)}-KnowEligible`

   const capitalizeFirstLetter=(string)=>{
    return string.charAt(0).toUpperCase()+string.slice(1)
  }

  const updateNews=async()=>{
    props.setProgress(10)
    props.setProgress(40)
    let url=`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apikey=9e9edcf8591e4503b7de5d794a2ea39f&page=1&pageSize=${props.pageSize}`
    props.setProgress(70)
    setLoading({loading: true})
    let data=await fetch(url)
    let parsedData= await data.json()
    console.log(parsedData)
    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)
    props.setProgress(100)

  }
  useEffect(()=>{
    document.title=`${capitalizeFirstLetter(props.category)}-KnowEligible`
    updateNews()
  },[])
  

  const handlePreviousClick=async()=>{
    setPage(page-1)
    updateNews()
  }

  const handleNextClick=async()=>{
    setPage(page+1)
    updateNews()
  }
  const fetchMoreData = async() => {
    setPage(page+1)
    let url=`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apikey=9e9edcf8591e4503b7de5d794a2ea39f&page=${page+1}&pageSize=${props.pageSize}`
    let data=await fetch(url)
    let parsedData= await data.json()
    console.log(parsedData)
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)
  }

    return (
      <div className='container my-3'>
        <h1 className="text-center" style={{margin: '35px', marginTop: '90px'}}>knowEligible - Top {capitalizeFirstLetter(props.category)} headlines</h1>
        {loading && <Spinner/>}
        
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length!==totalResults}
          loader={<Spinner/>}
          style={{ overflowX: 'hidden' }}
        >
          <div className="container">

            <div className="row">
              {articles.map((element)=>{
                return <div className="col-md-4" key={element.url} >
                          <NewsItem title={element.title?element.title:""} description={element.description?element.description:""} imUrl={element.urlToImage}  newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                      </div>
              })}
            </div>
            </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between" >
          <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePreviousClick}>&larr;Previous</button>
          <button  disabled={this.state.page+1>Math.ceil(this.state.totalResults/props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next&rarr;</button>
        </div> */}

      </div>
    )
    News.defaultProps={
      country: 'in',
      pageSize: 8,
      category: 'general',
    }
    
    News.propTypes={
      country : PropTypes.string,
      pageSize: PropTypes.number,
      category: PropTypes.string,
    }
  }
  export default News

