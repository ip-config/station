import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { isExtension } from '../utils/env'
import ErrorComponent from '../components/ErrorComponent'
import Dashboard from '../pages/dashboard/Dashboard'
import Bank from '../pages/bank/Bank'
import Txs from '../pages/txs/Txs'
import Staking from '../pages/staking/Staking'
import Validator from '../pages/validator/Validator'
import Market from '../pages/market/Market'
import Governance from '../pages/governance/Governance'
import Proposal from '../pages/proposal/Proposal'
import Contracts from '../pages/contracts/Contracts'
import Extension from '../extension/Extension'
import Auth from '../auth/Auth'

export default isExtension ? (
  <Switch>
    <Route path="/" component={Extension} exact />
    <Route path="/wallet" component={Bank} />
    <Route path="/auth" component={Auth} />
    <Route render={() => <ErrorComponent card />} />
  </Switch>
) : (
  <Switch>
    <Route path="/" component={Dashboard} exact />
    <Route path="/wallet" component={Bank} />
    <Route path="/history" component={Txs} />
    <Route path="/staking" component={Staking} />
    <Route path="/validator/:address" component={Validator} />
    <Route path="/market" component={Market} />
    <Route path="/governance" component={Governance} />
    <Route path="/proposal/:id" component={Proposal} />
    <Route path="/contracts" component={Contracts} />
    <Route render={() => <ErrorComponent card />} />
  </Switch>
)
