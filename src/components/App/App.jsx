import { Component, useEffect, useState } from 'react';
import { getImages } from 'Services/services';

import { Box } from 'components/Common/Box.styled';
import { Searchbar } from 'components/Searchbar/Searchbar';
import { Message } from 'components/Message/Message';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Button } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';
import { Modal } from 'components/Modal/Modal';
import { Footer } from 'components/Footer/Footer';

const LS_LAST_QUERY = 'goit_hw_lastQuery';
const LS_LAST_PAGE = 'goit_hw_lastPage';
const DEFAULT_SEARCH = 'Red poppy flower';

// const initialStateValues = {
//   images: [],
//   query: '',
//   page: 1,
//   totalHits: 0,
//   errorMessage: '',
//   isLoading: false,
//   showModalUrl: '',
// };

export const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalHits, setTotalHits] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModalUrl, setShowModalUrl] = useState('');

  useEffect(() => {
    const lsQuery = localStorage.getItem(LS_LAST_QUERY)?.toString();
    const lsPage = parseInt(localStorage.getItem(LS_LAST_PAGE)?.toString());

    setQuery(lsQuery && lsPage ? lsQuery : DEFAULT_SEARCH);
    setPage(lsQuery && lsPage ? lsPage : 1);
  }, []);

  useEffect(() => {
    loadImages({ query, page });
  }, [page, query]);

  const loadImages = async ({ query, page }) => {
    localStorage.setItem(LS_LAST_QUERY, query);
    localStorage.setItem(LS_LAST_PAGE, parseInt(page));

    setIsLoading(true);
    setTotalHits(0);
    setErrorMessage('');
    setImages([]);

    const { data } = await getImages({ query, page });

    if (data) {
      if (parseInt(data?.totalHits) > 0) {
        setImages(data.hits);
        setTotalHits(data.totalHits);
      } else setErrorMessage('No images found');
    } else setErrorMessage('No images loaded (Error occured)');

    setIsLoading(false);
  };

  const onLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const onSearch = (searchQuery = DEFAULT_SEARCH) => {
    if (searchQuery === '') searchQuery = DEFAULT_SEARCH;
    setQuery(searchQuery);
    setPage(1);
  };

  const onToggleModalImage = (url = '') => {
    setShowModalUrl(url);
  };

  const onModalKeyDown = e => {
    if (e.code === 'Escape') onToggleModalImage('');
  };

    return (
      <Box padding="0" height="100vh">
        <Searchbar onSubmit={onSearch} />
        <Box flex="1 0 auto" minHeight="calc(100vh - (220px + 40px))">
          {/* Image gallery */}
          {images.length > 0 ? (
            <ImageGallery onToggleModalImage={onToggleModalImage} images={images} />
          ) : (
            <Message>{errorMessage}</Message>
          )}

          {/* Load more button */}
          {totalHits > page * 12 && (
            <Box display="flex" justifyContent="center" width="100%" mt="20px">
              <Button onClick={onLoadMore}>Load more...</Button>
            </Box>
          )}
        </Box>

        {/* Loader */}
        {isLoading && <Loader />}

        {/* Modal window */}
        {showModalUrl !== '' && (
          <Modal onKeyDown={onModalKeyDown} onCloseModal={() => onToggleModalImage('')}>
            <img src={showModalUrl} width="1280" alt="" />
          </Modal>
        )}

        <Footer />
      </Box>
    );
};

export class OldApp extends Component {
  // state = { ...initialStateValues };

  // componentDidMount() {
  //   const lsQuery = localStorage.getItem(LS_LAST_QUERY)?.toString();
  //   const lsPage = parseInt(localStorage.getItem(LS_LAST_PAGE)?.toString());

  //   if (lsQuery && lsPage) this.setState({ query: lsQuery, page: lsPage });
  //   else this.setState({ query: DEFAULT_SEARCH, page: 1 });
  // }

  // componentDidUpdate(_, prevState) {
  //   const { query, page } = this.state;

  //   if (prevState.query !== query || prevState.page !== page) this.loadImages({ query, page });
  // }

  // loadImages = async ({ query, page }) => {
  //   localStorage.setItem(LS_LAST_QUERY, query);
  //   localStorage.setItem(LS_LAST_PAGE, parseInt(page));

  //   this.setState({ images: [], errorMessage: '', isLoading: true, totalHits: 0 });

  //   const { data } = await getImages({ query, page });

  //   if (data) {
  //     if (parseInt(data?.totalHits) > 0) this.setState({ images: data.hits, totalHits: data.totalHits });
  //     else this.setState({ errorMessage: 'No images found' });
  //   } else this.setState({ errorMessage: 'No images loaded (Error occured)' });

  //   this.setState({ isLoading: false });
  // };

  // onLoadMore = () => {
  //   this.setState(({ page }) => ({ page: page + 1 }));
  // };

  // onSearch = (searchQuery = DEFAULT_SEARCH) => {
  //   if (searchQuery === '') searchQuery = DEFAULT_SEARCH;
  //   this.setState({ query: searchQuery, page: 1 });
  // };

  // onToggleModalImage = (url = '') => {
  //   this.setState({ showModalUrl: url });
  // };

  // onModalKeyDown = e => {
  //   if (e.code === 'Escape') this.onToggleModalImage('');
  // };

  // render() {
  //   const { images, errorMessage, totalHits, page, isLoading, showModalUrl } = this.state;

  //   return (
  //     <Box padding="0" height="100vh">
  //       <Searchbar onSubmit={this.onSearch} />
  //       <Box flex="1 0 auto" minHeight="calc(100vh - (220px + 40px))">
  //         {/* Image gallery */}
  //         {images.length > 0 ? (
  //           <ImageGallery onToggleModalImage={this.onToggleModalImage} images={images} />
  //         ) : (
  //           <Message>{errorMessage}</Message>
  //         )}

  //         {/* Load more button */}
  //         {totalHits > page * 12 && (
  //           <Box display="flex" justifyContent="center" width="100%" mt="20px">
  //             <Button onClick={this.onLoadMore}>Load more...</Button>
  //           </Box>
  //         )}
  //       </Box>

  //       {/* Loader */}
  //       {isLoading && <Loader />}

  //       {/* Modal window */}
  //       {showModalUrl !== '' && (
  //         <Modal onKeyDown={this.onModalKeyDown} onCloseModal={() => this.onToggleModalImage('')}>
  //           <img src={showModalUrl} width="1280" alt="" />
  //         </Modal>
  //       )}

  //       <Footer />
  //     </Box>
  //   );
  // }
}
