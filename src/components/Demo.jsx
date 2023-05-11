import { useState, useEffect } from "react";
import { BsArrowDownRight } from 'react-icons/bs'
import {copy, loader, tick, linkIcon} from '../assets';
import { useLazyGetSummaryQuery } from "../app/article";
import { all } from "axios";

const Demo = () => {
  const [article, setArticle] = useState({
    url: '',
    summary: '',
  })

  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] =useState('')
  const [getSummary, {error, isFetching}] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articleFromLocalStorage = JSON.parse(
      localStorage.getItem('articles')
    )

    if (articleFromLocalStorage) {
      setAllArticles(articleFromLocalStorage)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    // get data
    const { data } = await getSummary({
      articleUrl: article.url,
    })

    // save data
    if(data?.summary) {
      const newArticle = {...article, summary:data.summary};

      const updateArticles = [newArticle, ...allArticles]

      setArticle(newArticle);
      setAllArticles(updateArticles);

      localStorage.setItem('articles', JSON.stringify(updateArticles))
    }
  };

  const copyToClipboard = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(''), 3000);
  }

  return (
    <section className="mt-16 w-full max-w-xl">
      {/* search */}
      <div className="flex flex-col w-full gap-2">
        <form 
          action="" 
          className="relative flex justify-center items-center" onSubmit={handleSubmit}
        >
          <img 
            src={linkIcon} 
            alt="link-icon" 
            className="absolute left-0 my-2 ml-3 w-5" 
          />
          <input 
            type="text" 
            placeholder="Enter a URL"
            value={article.url}
            onChange={(e) => setArticle({...article, url: e.target.value})}
            required
            className="url_input peer"
          />
          <button
            type="button"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            <BsArrowDownRight />
          </button>
        </form>

        {/* Browse Url history */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className="link_card"
            >
              <div className="copy_btn" onClick={() => copyToClipboard(item.url)}>
                <img src={copied === item.url ? tick : copy} alt="copy-icon" className="w-[40%%] h-[40%] object-contain" />
              </div>
              <p className="flex-1 font-satoshi text-purple-700 font-medium text-sm truncate">
                {item.url}
              </p>

            </div>
          ))}
        </div>

      </div>

      {/* display result */}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (<img src={loader} alt="loader" className="w-20 h-20 object-contain"/>) : error ? (<p className='font-bold font-inter text-black text-center'>
          Sorry, Try again! 😟 
          <br />
          <span className='font-satoshi font-normal text-red-500'>
            {error?.data?.error}
          </span>
          </p>) : (
            article.summary && (
              <div className="flex flex-col gap-3">
                <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                  Article <span className="blue_gradient">Summary</span>
                </h2>
                <div className="summary_box">
                  <p className="font-inter font-medium text-sm text-gray-700">{article.summary}</p>
                </div>
              </div>
            )
          )}

      </div>
      
    </section>
  )
}

export default Demo