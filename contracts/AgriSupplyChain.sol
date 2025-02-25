// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract AgriSupplyChain {
    address public Owner;

    constructor() {
        Owner = msg.sender;
    }

    modifier onlyByOwner() {
        require(msg.sender == Owner, "Only owner can perform this action");
        _;
    }

    enum STAGE {
        Registered,
        Planted,
        Harvested,
        Processed,
        Distributed,
        Retail,
        Sold
    }

    // Counters
    uint256 public productCtr = 0;
    uint256 public farmerCtr = 0;
    uint256 public processorCtr = 0;
    uint256 public distributorCtr = 0;
    uint256 public retailerCtr = 0;

    struct AgriculturalProduct {
        uint256 id;
        string name;
        string description;
        uint256 farmerId;
        uint256 processorId;
        uint256 distributorId;
        uint256 retailerId;
        STAGE stage;
    }

    mapping(uint256 => AgriculturalProduct) public ProductStock;

    function showStage(uint256 _productId) public view returns (string memory) {
        require(productCtr > 0, "No products registered yet");
        STAGE currentStage = ProductStock[_productId].stage;

        if (currentStage == STAGE.Registered) return "Product Registered";
        if (currentStage == STAGE.Planted) return "Planted";
        if (currentStage == STAGE.Harvested) return "Harvested";
        if (currentStage == STAGE.Processed) return "Processed";
        if (currentStage == STAGE.Distributed) return "Distributed";
        if (currentStage == STAGE.Retail) return "In Retail";
        if (currentStage == STAGE.Sold) return "Sold";
        return "Unknown Stage";
    }

    // Role Structures
    struct Farmer {
        address addr;
        uint256 id;
        string name;
        string location;
    }

    struct Processor {
        address addr;
        uint256 id;
        string name;
        string location;
    }

    struct Distributor {
        address addr;
        uint256 id;
        string name;
        string location;
    }

    struct Retailer {
        address addr;
        uint256 id;
        string name;
        string location;
    }

    // Role Mappings
    mapping(uint256 => Farmer) public Farmers;
    mapping(uint256 => Processor) public Processors;
    mapping(uint256 => Distributor) public Distributors;
    mapping(uint256 => Retailer) public Retailers;

    // Add Role Functions
    function addFarmer(
        address _address,
        string memory _name,
        string memory _location
    ) public onlyByOwner {
        farmerCtr++;
        Farmers[farmerCtr] = Farmer(_address, farmerCtr, _name, _location);
    }

    function addProcessor(
        address _address,
        string memory _name,
        string memory _location
    ) public onlyByOwner {
        processorCtr++;
        Processors[processorCtr] = Processor(
            _address,
            processorCtr,
            _name,
            _location
        );
    }

    function addDistributor(
        address _address,
        string memory _name,
        string memory _location
    ) public onlyByOwner {
        distributorCtr++;
        Distributors[distributorCtr] = Distributor(
            _address,
            distributorCtr,
            _name,
            _location
        );
    }

    function addRetailer(
        address _address,
        string memory _name,
        string memory _location
    ) public onlyByOwner {
        retailerCtr++;
        Retailers[retailerCtr] = Retailer(
            _address,
            retailerCtr,
            _name,
            _location
        );
    }

    function getUserRole(address _user) public view returns (string memory) {
        for (uint256 i = 1; i <= farmerCtr; i++) {
            if (Farmers[i].addr == _user) return "Farmer";
        }
        for (uint256 i = 1; i <= processorCtr; i++) {
            if (Processors[i].addr == _user) return "Processor";
        }
        for (uint256 i = 1; i <= distributorCtr; i++) {
            if (Distributors[i].addr == _user) return "Distributor";
        }
        for (uint256 i = 1; i <= retailerCtr; i++) {
            if (Retailers[i].addr == _user) return "Retailer";
        }
        return "Unknown"; // Default if no role found
    }

    // Stage Transition Functions
    function plantProduct(uint256 _productId) public {
        require(
            _productId > 0 && _productId <= productCtr,
            "Invalid product ID"
        );
        uint256 fid = findFarmer(msg.sender);
        require(fid > 0, "Unauthorized farmer");
        require(
            ProductStock[_productId].stage == STAGE.Registered,
            "Invalid stage transition"
        );

        ProductStock[_productId].farmerId = fid;
        ProductStock[_productId].stage = STAGE.Planted;
        emit ProductPlanted(_productId, fid);
    }

    function harvestProduct(uint256 _productId) public {
        require(
            _productId > 0 && _productId <= productCtr,
            "Invalid product ID"
        );
        uint256 fid = findFarmer(msg.sender);
        require(
            fid > 0 && fid == ProductStock[_productId].farmerId,
            "Unauthorized farmer"
        );
        require(
            ProductStock[_productId].stage == STAGE.Planted,
            "Invalid stage transition"
        );

        ProductStock[_productId].stage = STAGE.Harvested;
        emit ProductHarvested(_productId, fid);
    }

    function processProduct(uint256 _productId) public {
        require(
            _productId > 0 && _productId <= productCtr,
            "Invalid product ID"
        );
        uint256 pid = findProcessor(msg.sender);
        require(pid > 0, "Unauthorized processor");
        require(
            ProductStock[_productId].stage == STAGE.Harvested,
            "Invalid stage transition"
        );

        ProductStock[_productId].processorId = pid;
        ProductStock[_productId].stage = STAGE.Processed;
        emit ProductProcessed(_productId, pid);
    }

    function distributeProduct(uint256 _productId) public {
        require(
            _productId > 0 && _productId <= productCtr,
            "Invalid product ID"
        );
        uint256 did = findDistributor(msg.sender);
        require(did > 0, "Unauthorized distributor");
        require(
            ProductStock[_productId].stage == STAGE.Processed,
            "Invalid stage transition"
        );

        ProductStock[_productId].distributorId = did;
        ProductStock[_productId].stage = STAGE.Distributed;
        emit ProductDistributed(_productId, did);
    }

    function receiveProduct(uint256 _productId) public {
        require(
            _productId > 0 && _productId <= productCtr,
            "Invalid product ID"
        );
        uint256 rid = findRetailer(msg.sender);
        require(rid > 0, "Unauthorized retailer");
        require(
            ProductStock[_productId].stage == STAGE.Distributed,
            "Invalid stage transition"
        );

        ProductStock[_productId].retailerId = rid;
        ProductStock[_productId].stage = STAGE.Retail;
        emit ProductReceived(_productId, rid);
    }

    function sellProduct(uint256 _productId) public {
        require(
            _productId > 0 && _productId <= productCtr,
            "Invalid product ID"
        );
        uint256 rid = findRetailer(msg.sender);
        require(
            rid > 0 && rid == ProductStock[_productId].retailerId,
            "Unauthorized retailer"
        );
        require(
            ProductStock[_productId].stage == STAGE.Retail,
            "Invalid stage transition"
        );

        ProductStock[_productId].stage = STAGE.Sold;
        emit ProductSold(_productId, rid);
    }

    // Helper Functions
    function findFarmer(address _address) private view returns (uint256) {
        for (uint256 i = 1; i <= farmerCtr; i++) {
            if (Farmers[i].addr == _address) return i;
        }
        return 0;
    }

    function findProcessor(address _address) private view returns (uint256) {
        for (uint256 i = 1; i <= processorCtr; i++) {
            if (Processors[i].addr == _address) return i;
        }
        return 0;
    }

    function findDistributor(address _address) private view returns (uint256) {
        for (uint256 i = 1; i <= distributorCtr; i++) {
            if (Distributors[i].addr == _address) return i;
        }
        return 0;
    }

    function findRetailer(address _address) private view returns (uint256) {
        for (uint256 i = 1; i <= retailerCtr; i++) {
            if (Retailers[i].addr == _address) return i;
        }
        return 0;
    }

    function addProduct(
        string memory _name,
        string memory _description
    ) public onlyByOwner {
        require(
            farmerCtr > 0 &&
                processorCtr > 0 &&
                distributorCtr > 0 &&
                retailerCtr > 0,
            "All roles must be registered first"
        );
        productCtr++;
        ProductStock[productCtr] = AgriculturalProduct(
            productCtr,
            _name,
            _description,
            0,
            0,
            0,
            0,
            STAGE.Registered
        );
        emit ProductRegistered(productCtr, _name, _description);
    }

    // Events to match component expectations
    event ProductRegistered(uint256 indexed id, string name, string description);
    event ProductPlanted(uint256 indexed id, uint256 farmerId);
    event ProductHarvested(uint256 indexed id, uint256 farmerId);
    event ProductProcessed(uint256 indexed id, uint256 processorId);
    event ProductDistributed(uint256 indexed id, uint256 distributorId);
    event ProductReceived(uint256 indexed id, uint256 retailerId);
    event ProductSold(uint256 indexed id, uint256 retailerId);
}
