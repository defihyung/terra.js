import { Coin, Dec, Numeric, Denom } from '../../../core';
import { BaseAPI } from './BaseAPI';

export interface MarketParams {
  /** Number of blocks it takes for the Terra & Luna pools to naturally "reset" towards
   * equilibrium through automated pool replenishing.
   */
  pool_recovery_period: number;

  /** Initial starting size of both Terra and Luna liquidity pools. */
  base_pool: Dec;

  /** Minimum spread charged on Terra<>Luna swaps to prevent leaking value from front-running attacks. */
  min_spread: Dec;
}

export namespace MarketParams {
  export interface Data {
    pool_recovery_period: string;
    base_pool: string;
    min_spread: string;
  }
}

export class MarketAPI extends BaseAPI {
  /**
   * Gets the Market's swap rate for a given coin to a requested denomination.
   * @param offerCoin coin to convert
   * @param askDenom denomination to swap into
   */
  public async swapRate(offerCoin: Coin, askDenom: Denom): Promise<Coin> {
    const params = {
      offer_coin: offerCoin.toString(),
      ask_denom: askDenom,
    };

    return this.c
      .get<Coin.Data>(`/market/swap`, params)
      .then(d => Coin.fromData(d.result));
  }

  /**
   * Gets current value of the pool delta, which is used to determine Terra<>Luna swap rates.
   */
  public async terraPoolDelta(): Promise<Dec> {
    return this.c
      .get<Numeric.Input>(`/market/terra_pool_delta`)
      .then(d => new Dec(d.result));
  }

  /**
   * Gets the current Market module's parameters.
   */
  public async parameters(): Promise<MarketParams> {
    return this.c
      .get<MarketParams.Data>(`/market/parameters`)
      .then(({ result: d }) => ({
        pool_recovery_period: Number.parseInt(d.pool_recovery_period),
        base_pool: new Dec(d.base_pool),
        min_spread: new Dec(d.min_spread),
      }));
  }
}
