// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgriChain {
    struct Stock {
        string stockId;
        string name;
        uint256 quantity;
        uint256 unitPrice;
        address owner;
        string parentId;
        string[] history;
        uint256[] priceHistory;
        uint256[] qtyHistory;
    }

    mapping(string => Stock) public stocks;

    event FarmerStockCreated(string stockId, string name, uint256 qty, uint256 price, address farmer);
    event DistributorBought(string stockId, string parentId, uint256 qty, uint256 price, address distributor);
    event StockSold(string stockId, string newStockId, uint256 qty, uint256 price, address seller, address buyer);

    // === Farmer creates base stock ===
    function createFarmerStock(string memory stockId, string memory name, uint256 qty, uint256 price) public {
        require(stocks[stockId].owner == address(0), "Stock ID already exists");
        require(qty > 0, "Invalid quantity");
        require(price > 0, "Invalid price");

        Stock storage s = stocks[stockId];
        s.stockId = stockId;
        s.name = name;
        s.quantity = qty;
        s.unitPrice = price;
        s.owner = msg.sender;
        s.parentId = "";

        s.history.push(stockId);
        s.priceHistory.push(price);
        s.qtyHistory.push(qty);

        emit FarmerStockCreated(stockId, name, qty, price, msg.sender);
    }

    // === Distributor buys part of stock ===
    function distributorBuy(string memory parentId, string memory newStockId, uint256 qty) public {
        Stock storage parent = stocks[parentId];
        require(parent.owner != address(0), "Parent stock does not exist");
        require(parent.quantity >= qty, "Not enough stock");

        parent.quantity -= qty;

        Stock storage s = stocks[newStockId];
        s.stockId = newStockId;
        s.name = parent.name;
        s.quantity = qty;
        s.unitPrice = parent.unitPrice;
        s.owner = msg.sender;
        s.parentId = parentId;

        s.history.push(parentId);
        s.history.push(newStockId);
        s.priceHistory.push(parent.unitPrice);
        s.qtyHistory.push(qty);

        emit DistributorBought(newStockId, parentId, qty, parent.unitPrice, msg.sender);
    }

    // === Sell stock with max 20% margin ===
    function sellStock(string memory parentId, string memory newStockId, uint256 qty, uint256 newPrice, address buyer) public {
        Stock storage parent = stocks[parentId];
        require(parent.owner == msg.sender, "Not owner of stock");
        require(parent.quantity >= qty, "Not enough quantity");
        require(newPrice >= parent.unitPrice, "Price must be >= cost");
        require(newPrice <= parent.unitPrice * 120 / 100, "Max 20% margin allowed");

        parent.quantity -= qty;

        Stock storage s = stocks[newStockId];
        s.stockId = newStockId;
        s.name = parent.name;
        s.quantity = qty;
        s.unitPrice = newPrice;
        s.owner = buyer;
        s.parentId = parentId;

        // copy parent history
        for (uint i = 0; i < parent.history.length; i++) {
            s.history.push(parent.history[i]);
        }
        s.history.push(newStockId);

        for (uint i = 0; i < parent.priceHistory.length; i++) {
            s.priceHistory.push(parent.priceHistory[i]);
        }
        s.priceHistory.push(newPrice);

        for (uint i = 0; i < parent.qtyHistory.length; i++) {
            s.qtyHistory.push(parent.qtyHistory[i]);
        }
        s.qtyHistory.push(qty);

        emit StockSold(parentId, newStockId, qty, newPrice, msg.sender, buyer);
    }

    // === View stock history ===
    function getStockHistory(string memory stockId) public view returns (
        string[] memory, uint256[] memory, uint256[] memory
    ) {
        Stock storage s = stocks[stockId];
        return (s.history, s.priceHistory, s.qtyHistory);
    }
}