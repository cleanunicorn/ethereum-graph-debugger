import React from 'react';

import styles from '../../styles/SideBar.scss';

class SideBar extends React.Component {

  handleClick(type) {
    this.props.onClick(type);
  }

  render() {

    const { onTransactionDebuggerClick, onControlFlowGraphClick, onDisassemblerClick } = this.props;

    return (
      <div className={styles['side-bar']}>
        <div className={styles['side-bar__item']} onClick={onTransactionDebuggerClick}>
          <span>Debug Transaction</span>
        </div>
        <div className={styles['side-bar__item']} onClick={onDisassemblerClick}>
          <span>Disassembler</span>
        </div>
        <div className={styles['side-bar__item']} onClick={onControlFlowGraphClick}>
          <span>Control Flow Graph</span>
        </div>
      </div>
    )
  }
}

SideBar.displayName = 'SideBar';

export default SideBar;
