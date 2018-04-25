import { createFetchReducer } from './fetch.reducer'
import { FETCH, FETCH_NEXT_PAGE, FETCH_PREVIOUS_PAGE, SEARCH, UPDATE, ERROR } from 'actions/fetch.actions'
import { MAX_ITEMS } from 'models/fetch.model'

const initialState = {
  items: [],
  loading: true,
  error: undefined,
  loadingPrevious: false,
  loadingNext: false,
  next: '',
  previous: '',
}

const getFetchResult = (count) => Array(count).fill(undefined).map((_, id) => ({ id }))

export function testWithScope(scope?: string) {
  describe('Fetch reducer', () => {
    const reducer = createFetchReducer({ scope })
    it(`should handle ${FETCH} action`, () => {
      const beforeState = {
        ...initialState,
        loading: false,
        loadingPrevious: true,
        loadingNext: true,
        error: 'error',
      }
      const afterState = {
        ...initialState,
        loading: true,
        loadingPrevious: false,
        loadingNext: false,
        error: undefined,
      }

      expect(reducer(beforeState, { type: FETCH, scope })).toEqual(afterState)
    })
    
    it(`should handle ${FETCH_NEXT_PAGE} action`, () => {
      const beforeState = {
        ...initialState,
        loading: true,
        loadingPrevious: true,
        loadingNext: false,
        error: 'error',
      }
      const afterState = {
        ...initialState,
        loading: false,
        loadingPrevious: false,
        loadingNext: true,
        error: undefined,
      }

      expect(reducer(beforeState, { type: FETCH_NEXT_PAGE, scope })).toEqual(afterState)
      
    })
    
    it(`should handle ${FETCH_PREVIOUS_PAGE} action`, () => {
      const beforeState = {
        ...initialState,
        loading: true,
        loadingPrevious: false,
        loadingNext: true,
        error: 'error',
      }
      const afterState = {
        ...initialState,
        loading: false,
        loadingPrevious: true,
        loadingNext: false,
        error: undefined,
      }

      expect(reducer(beforeState, { type: FETCH_PREVIOUS_PAGE, scope })).toEqual(afterState)
      
    })
    
    it(`should handle ${SEARCH} action`, () => {
      const beforeState = {
        ...initialState,
        loading: true,
        loadingPrevious: false,
        loadingNext: true,
        error: 'error',
      }
      const afterState = {
        ...initialState,
        loading: false,
        loadingPrevious: true,
        loadingNext: false,
        error: undefined,
      }

      expect(reducer(beforeState, { type: FETCH_PREVIOUS_PAGE, scope })).toEqual(afterState)
      
    })
    
    it(`should handle ${ERROR} action`, () => {
      const error = 'error'
      const beforeState = {
        ...initialState,
        loading: true,
        loadingPrevious: false,
        loadingNext: true,
        error: undefined,
      }
      const afterState = {
        ...initialState,
        loading: false,
        loadingPrevious: false,
        loadingNext: false,
        error,
      }

      expect(reducer(beforeState, { type: ERROR, scope, payload: { error } })).toEqual(afterState)
      
    })
    
    describe(`${UPDATE} action`, () => {
      it('should reset loading and error attributes', () => {
        const beforeState = {
          ...initialState,
          loading: true,
          loadingPrevious: true,
          loadingNext: true,
          error: 'error',
        }
        const afterState = {
          ...initialState,
          loading: false,
          loadingPrevious: false,
          loadingNext: false,
          error: undefined,
        }
  
        expect(reducer(beforeState, {
          type: UPDATE, scope,
          payload: {}
        })).toEqual(afterState)
      })

      it('should reset items', () => {
        const results = getFetchResult(20)
        const beforeState = reducer(initialState, {
          type: UPDATE, scope,
          payload: {}
        })
        const afterState = {
          ...beforeState,
          items: results
        }
  
        expect(reducer(beforeState, {
          type: UPDATE, scope,
          payload: { results }
        })).toEqual(afterState)
      })

      it('should concat items from left', () => {
        const results1 = getFetchResult(20)
        const results2 = getFetchResult(20).map(({ id }) => ({ id: id * 2 }))
        const beforeState = reducer(initialState, {
          type: UPDATE, scope,
          payload: { results: results1 }
        })
        const afterState = {
          ...beforeState,
          items: [...results2, ...results1]
        }
  
        expect(reducer(beforeState, {
          type: UPDATE, scope,
          payload: { results: results2, concatType: 'left' }
        })).toEqual(afterState)
      })

      it('should concat items from right', () => {
        const results1 = getFetchResult(20)
        const results2 = getFetchResult(20).map(({ id }) => ({ id: id * 2 }))
        const beforeState = reducer(initialState, {
          type: UPDATE, scope,
          payload: { results: results1 }
        })
        const afterState = {
          ...beforeState,
          items: [...results1, ...results2]
        }
  
        expect(reducer(beforeState, {
          type: UPDATE, scope,
          payload: { results: results2, concatType: 'right' }
        })).toEqual(afterState)
      })

      it(`should not load more then ${MAX_ITEMS} items upon right concat`, () => {
        const results1 = getFetchResult(60)
        const results2 = getFetchResult(60).map(({ id }) => ({ id: id * 2 }))
        const beforeState = reducer(initialState, {
          type: UPDATE, scope,
          payload: { results: results1 }
        })
        const afterState = {
          ...beforeState,
          items: [...results1, ...results2]
        }
  
        expect(reducer(beforeState, {
          type: UPDATE, scope,
          payload: { results: results2, concatType: 'right' }
        }).items).toEqual(afterState.items.slice(-MAX_ITEMS))
      })

      it(`should not load more then ${MAX_ITEMS} items upon left concat`, () => {
        const results1 = getFetchResult(60)
        const results2 = getFetchResult(60).map(({ id }) => ({ id: id * 2 }))
        const beforeState = reducer(initialState, {
          type: UPDATE, scope,
          payload: { results: results1 }
        })
        const afterState = {
          ...beforeState,
          items: [...results2, ...results1]
        }
  
        expect(reducer(beforeState, {
          type: UPDATE, scope,
          payload: { results: results2, concatType: 'left' }
        }).items).toEqual(afterState.items.slice(0, MAX_ITEMS))
      })

      it(`should replcae next and previous`, () => {
        const next = 'nextPage'
        const previous = 'previousPage'
        const results = getFetchResult(20)
        const beforeState = reducer(initialState, {
          type: UPDATE, scope,
          payload: { results }
        })
        const afterState = {
          ...beforeState,
          next,
          previous
        }
  
        expect(reducer(beforeState, {
          type: UPDATE, scope,
          payload: { results, next, previous }
        })).toEqual(afterState)
      })

      it(`should not replace previous on concat right if there's enough place for all items`, () => {
        const next = 'nextPage'
        const previous = 'previousPage'
        const results = getFetchResult(20)
        const beforeState = reducer(initialState, {
          type: UPDATE, scope,
          payload: { results }
        })
        const afterState = {
          ...beforeState,
          items: [ ...results, ...results ],
          next
        }
  
        expect(reducer(beforeState, {
          type: UPDATE, scope,
          payload: { results, next, previous, concatType: 'right' }
        })).toEqual(afterState)
      })

      it(`should not replace next on concat left if there's enough place for all items`, () => {
        const next = 'nextPage'
        const previous = 'previousPage'
        const results = getFetchResult(20)
        const beforeState = reducer(initialState, {
          type: UPDATE, scope,
          payload: { results }
        })
        const afterState = {
          ...beforeState,
          items: [ ...results, ...results ],
          previous
        }
  
        expect(reducer(beforeState, {
          type: UPDATE, scope,
          payload: { results, next, previous, concatType: 'left' }
        })).toEqual(afterState)
      })

      it(`should update previous toId param on concat right if there's not enough place for all items`, () => {
        const next = 'nextPage'
        const previous = 'toId=10'
        const updatedprevious = 'toId=19'
        const results = getFetchResult(60)
        const beforeState = reducer(initialState, {
          type: UPDATE, scope,
          payload: { results }
        })
        const afterState = {
          ...beforeState,
          items: [ ...results, ...results ].slice(-MAX_ITEMS),
          previous: updatedprevious,
          next
        }
  
        expect(reducer(beforeState, {
          type: UPDATE, scope,
          payload: { results, next, previous, concatType: 'right' }
        })).toEqual(afterState)
      })
    })

    it(`should update previous fromId param on concat left if there's not enough place for all items`, () => {
      const previous = 'previousPage'
      const next = 'fromId=10'
      const updatednext = 'fromId=39'
      const results = getFetchResult(60)
      const beforeState = reducer(initialState, {
        type: UPDATE, scope,
        payload: { results }
      })
      const afterState = {
        ...beforeState,
        items: [ ...results, ...results ].slice(0, MAX_ITEMS),
        next: updatednext,
        previous
      }

      expect(reducer(beforeState, {
        type: UPDATE, scope,
        payload: { results, next, previous, concatType: 'left' }
      })).toEqual(afterState)
    })
  })
}

testWithScope('SCOPE')
testWithScope()
