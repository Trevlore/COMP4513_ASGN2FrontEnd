import React from 'react';
import * as _ from "lodash";
import MovieFilter from './MovieFilter';
import MovieList from './MovieList';
import { getToken } from '../../services/auth'
import Layout from '../Layout/Layout';
// import {generateRegex, getSearchParam} from "../Helpers/Helper";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {faCaretLeft, faCaretRight, faSync} from "@fortawesome/free-solid-svg-icons";

export const defaultQueryParams = {
    title: "",
    minYear: 1900,
    maxYear: new Date().getFullYear(),
    minRating: 0,
    maxRating: 10
};

class Movies extends React.Component {

    constructor(props) {
        super(props);
        //const searchParams = _.cloneDeep(defaultQueryParams);
        //searchParams.title = getSearchParam("title");
        let movies = [];
        let loading = true;
        if (localStorage.getItem('movies')) {
            movies = this.getStoredMovies();
            loading = false
        }
        this.state = {
            movies: movies,
            filteredMovies: [],
            //searchParams: searchParams,
            isLoading: loading,
            movieFilterExpand: true
        }
    }

    getStoredMovies() {
        return JSON.parse(localStorage.getItem('movies')).map(x => {
            x.release_date = new Date(x.release_date);
            return x;
        });
    }

    async componentDidMount() {
        const newState = await _.cloneDeep(this.state);
        const token = getToken().token;
        if (!localStorage.getItem('movies')) {
            const request = await fetch(`http://localhost:8080/api/brief?auth_token=${token}`);
            
            let parsedMovies = await request.json();

            parsedMovies.map(x => {
                x.release_date = new Date(x.release_date);
                return x;
            });
            parsedMovies = parsedMovies.sort((a, b) => (a.title > b.title) - (a.title < b.title));
            newState.movies = parsedMovies;
            localStorage.setItem('movies', JSON.stringify(parsedMovies));
            newState.isLoading = false;
            this.setState(newState);
        }
        console.log("fetched stuff");
        this.filterOnQuery();
    }

    updateQuery = (searchParams) => {
        const newState = _.cloneDeep(this.state);
        newState.searchParams = searchParams;
        this.setState(newState);
    };

    filterOnQuery = () => {
        // const newState = _.cloneDeep(this.state);
        // newState.filteredMovies = newState.movies.filter((x) => {
        //     return generateRegex(this.state.searchParams.title).test(x.title) &&
        //         Number(x.release_date.getFullYear()) >= this.state.searchParams.minYear &&
        //         Number(x.release_date.getFullYear()) <= this.state.searchParams.maxYear &&
        //         Number(x.ratings.average) >= this.state.searchParams.minRating &&
        //         Number(x.ratings.average) <= this.state.searchParams.maxRating;
        // });
        // this.setState(newState);
    };
    toggleClose = (e) => {
        this.setState({...this.state, movieFilterExpand: !this.state.movieFilterExpand})
    };

    generateStyle() {
        return this.state.movieFilterExpand ? null : {marginLeft: "1em"}
    }

    render() {
        return (
            <React.Fragment>
                <Layout>
                <div className="columns">
                    {/* {this.state.movieFilterExpand ? <MovieFilter
                        updateQuery={this.updateQuery}
                        searchParams={this.state.searchParams}
                        onSearch={this.filterOnQuery}
                    /> : null} */}

                    <div className="findme" onClick={this.toggleClose} style={this.generateStyle()}>
                        {/* <FontAwesomeIcon icon={this.state.movieFilterExpand ? faCaretLeft : faCaretRight}
                                         className="fa-2x" style={{height: "55vh"}}/> */}
                    </div>
                    <div className="column has-text-centered">
                        {this.state.isLoading ? <div>Loading</div> :
                            //<FontAwesomeIcon icon={faSync} className="fa-spin fa-10x"/>
                            <MovieList movies={this.state.movies}/>

                        }

                    </div>
                </div>
                </Layout>
            </React.Fragment>
        )
    }
}

export default Movies;