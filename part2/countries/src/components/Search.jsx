const Search = ({ handler }) => {
    return (
        <div>
            <p>find countries</p>
            <input onChange={handler} type="text" />
        </div>
    );
};

export default Search;
