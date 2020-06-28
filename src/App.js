import React from 'react'
import Header from "./components/Header"
import Footer from "./components/Footer"
import MainContent from "./components/MainContent"
import r from './Login'

export default class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      defaultSubreddits: ['itookapicture', 'astrophotography', 'nocontextpics', 'houseplants'],
      postData: []
    }

    this.extractDataFromSubreddit = this.extractDataFromSubreddit.bind(this)

  }

  componentDidMount() {
    this.extractDataFromSubreddit(this.state.defaultSubreddits[Math.floor(Math.random() * this.state.defaultSubreddits.length)])
    //this.extractDataFromSubreddit('dogs')
  }

  // search reddit for subreddits which fit in with the user input and extract their data
  async extractDataFromSubreddit(userInput) {

    this.setState({loading: true})

    const possibleSubrredits = await r.searchSubreddits({query: userInput});
    const postData = [];
    let counter = 0;

    // Check if the subreddit has valid images, if not, repeat and check next best subreddit
    while(postData.length === 0){

      const postInformation = await r.getSubreddit(possibleSubrredits[counter].display_name).getNew();
      
      // Check which submissions have an image attached to them, push into new array
      for(const post of postInformation){
        if(post.url.match(/\.(jpeg|jpg|png)$/)){
          postData.push(post);
        }
      }

      counter++;

   }
    this.setState({ postData, loading: false});

    console.log(this.state.postData[0]);
  }

  render() {

    const { postData } = this.state;

    // Make a global counter
    // send all the data [counter]

    return (
      <div>
        {postData.length > 0 && (
          <div>
             <Header postTitle={postData[0].title} postSubreddit={postData[0].subreddit.display_name}/>
             <MainContent postUrl={postData[0].url}/>
             <Footer postAuthor={postData[0].author.name}/>
           </div>
        )}
      </div>
    );
  }

}
