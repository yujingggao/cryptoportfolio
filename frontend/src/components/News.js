import { useState, useContext, useEffect } from 'react'
import { Container, Card } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import UserContext from '../contexts/UserContext'
import newsAPIKey from '../api/newsAPIkey'


let News = (props) => {
    const { user } = useContext(UserContext)
    const [keywords, setKeywords] = useState(null)
    const [news, setNews] = useState(null)
    const [date, setDate] = useState(null)
    const [isLoaded, setisLoaded] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [pageCount, setPageCount] = useState(0)

    useEffect(() => {
        if (props.positions && user){
        const getKeyWords = async () => {
            let words = []
            props.positions.forEach((elem) => {
                words.push(elem.asset_id)
                })
            setKeywords(words.join(' '))
            }
        getKeyWords()
        }
    }, [props.positions])

// sets date to todays date 
     useEffect(() => {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();
            if(dd<10) 
            {
            dd='0'+dd;
            } 

            if(mm<10) 
            {
            mm='0'+mm;
            } 
        let currentDate = (yyyy+ '-' + mm + '-' + dd)
            setDate(currentDate)
        }, [])

// when fetches news and sets new variable 
    useEffect(() => {
        if (date){
        
        fetchNews()
        }
    }, [keywords])

    const fetchNews = async () => {
        const url = `http://api.mediastack.com/v1/news?access_key=${newsAPIKey}&date=${date}&countries=us&languages=en&limit=5&keywords=${keywords}&offset=${currentPage}`
        let response = await fetch(url)
        let data = await response.json()
        setNews(data)
        setPageCount(Math.ceil(data.pagination.total / data.pagination.limit))
        setisLoaded(true)
    }

    
    const handlePageChange = (event) => {
        console.log(event.selected)
        if ((((event.selected+1) * 5) - 5) <= 0) {
            setCurrentPage(0)
        } else {
		setCurrentPage(((event.selected+1) * 5) - 5);
        }
		fetchNews();
	};
    
    let renderNews = () => {
      
        return news.data.map((elem, index) => {
            return <Card className="news-cards" bg="dark" key={index}>
                        <Card.Body className="news-body">
                            <div className='card-title'><a href={elem.url}>{elem.title}</a></div>
                            <div className="card-author">{elem.author}</div>
                        </Card.Body>
                    </Card>
        })
    
    }


    return (
        <Container className="news">
            
            <div className='news-div'>
                <h5>Related News</h5>
           { isLoaded ? 
            renderNews()
            :
            <div></div>
            }
          
            {isLoaded ? (
                <div className="news-paginate">
				<ReactPaginate
					pageCount={pageCount}
					pageRange={0}
					marginPagesDisplayed={0}
					onPageChange={handlePageChange}
					containerClassName={'page-container'}
					previousLinkClassName={'page'}
					breakClassName={'page'}
					nextLinkClassName={'page'}
					pageClassName={'page'}
                    previousLabel={'PREV'}
                    nextLabel={'NEXT'}
					disabledClassName={'page-disabled'}
					activeClassName={'page-active'}
				/>
                </div>
			) : (
				<div>Nothing to display</div>
			)} 

            </div>
            </Container>
    )

}

export default News