var GIPHY_API_URL = 'https://api.giphy.com';
var GIPHY_PUB_KEY = 'ZisFAvNeXhnm8wUami0YkhV0wz7NOT1K';

App = React.createClass({
    getInitialState() {
        return {
            loading: false,
            searchingText: '',
            gif: {}
        };
    },

    handleSearch: function(searchingText) {
        this.setState({
            loading: true
        });
        this.getGif(searchingText, function(gif) {
            this.setState({
                loading: false,
                gif,
                searchingText
            });
        }.bind(this))
            .then(response => console.log('Contents: ' + response))
            .catch(error => console.error('Something went wrong', error));
    },

    getGif: function(searchingText, callback) {
        var url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;
        var xhr = new XMLHttpRequest();

        return new Promise(
            function(resolve, reject) {
                const request = new XMLHttpRequest();

                xhr.onload = function() {
                    if (xhr.status === 200) {
                        resolve(this.response);
                        var data = JSON.parse(xhr.responseText).data;
                        var gif = {
                            url: data.fixed_width_downsampled_url,
                            sourceUrl: data.url
                        };
                        callback(gif);
                    } else {
                        reject(new Error(this.statusText));
                    }
                };

                request.onerror = function() {
                    reject(new Error(
                        `XMLHttpRequest Error: ${this.statusText}`));
                };

                xhr.open('GET', url);
                xhr.send();
            });
    },

    render: function() {
        var styles = {
            margin: '0 auto',
            textAlign: 'center',
            width: '90%'
        };

        return (
            <div style={styles}>
                <h1>Wyszukiwarka GIFów!</h1>
                <p>Znajdź gifa na <a href="http://giphy.com">giphy</a>. Naciskaj enter, aby pobierać kolejne gify.</p>
                <Search onSearch={this.handleSearch}/>
                <Gif
                    loading={this.state.loading}
                    url={this.state.gif.url}
                    sourceUrl={this.state.gif.sourceUrl}
                />
            </div>
        )
    }
});